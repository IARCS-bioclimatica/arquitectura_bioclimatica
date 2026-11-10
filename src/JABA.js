let projects = [];

        // Crea una tarjeta por cada PDF, con vista previa y enlace para abrirlo.
        function renderProjects() {
            const grid = document.getElementById('projectsGrid');
            if (!grid) return;

            grid.innerHTML = projects.map((project) => {
                const title = project.title.replace(/\.pdf$/i, '');
                const pdfUrl = project.pdf.split('/').map(encodeURIComponent).join('/');
                const safeTitle = escapeHtml(title);
                const safePdfUrl = escapeHtml(pdfUrl);

                return `
                <article class="project-card project-card--pdf fade-in">
                    <iframe class="project-pdf-preview" src="${safePdfUrl}#view=FitH" title="Vista previa de ${safeTitle}" loading="lazy"></iframe>
                    <div class="project-body">
                        <span class="project-category">Documento PDF</span>
                        <h3>${safeTitle}</h3>
                        <p>Consulta la vista previa o abre el documento completo.</p>
                        <a class="project-pdf-link" href="${safePdfUrl}" target="_blank" rel="noopener">Abrir PDF completo</a>
                    </div>
                </article>
            `;
            }).join('');

            observeFadeIns();
        }

        // Obtiene el índice de PDF generado durante el despliegue y carga sus proyectos.
        async function loadProjects() {
            const grid = document.getElementById('projectsGrid');
            if (!grid) return;

            try {
                const response = await fetch('pdfs.json');
                if (!response.ok) {
                    throw new Error(`No se pudo cargar pdfs.json (${response.status}).`);
                }

                const pdfs = await response.json();
                if (!Array.isArray(pdfs) || !pdfs.every(pdf => typeof pdf === 'string')) {
                    throw new Error('El índice de PDF no tiene un formato válido.');
                }

                projects = pdfs.map(pdf => ({
                    title: pdf.split('/').pop(),
                    pdf
                }));
                if (projects.length === 0) {
                    grid.textContent = 'Aún no hay documentos PDF disponibles.';
                    return;
                }

                renderProjects();
            } catch (error) {
                console.error('Error al cargar los documentos PDF:', error);
                grid.textContent = 'No se pudieron cargar los documentos PDF. Intenta actualizar la página más tarde.';
            }
        }

        // Mantiene el promedio y el total de votos de las estrellas mientras la página está abierta.
        let currentRating = 0;
        let totalVotes = 0;
        let sumRatings = 0;

        const stars = document.querySelectorAll('#ratingStars span');
        const ratingValue = document.getElementById('ratingValue');

        stars.forEach(star => {
            // Registra un voto, actualiza el promedio y anima la estrella seleccionada.
            star.addEventListener('click', function() {
                const value = parseInt(this.dataset.value);
                currentRating = value;
                totalVotes++;
                sumRatings += value;

                // Actualizar estrellas visuales
                stars.forEach((s, i) => {
                    s.classList.toggle('active', i < value);
                });

                // Actualizar promedio
                const avg = (sumRatings / totalVotes).toFixed(1);
                ratingValue.textContent = avg;

                // Actualizar contador de votos
                this.parentElement.parentElement.querySelector('span:last-child').textContent = `(${totalVotes} votos)`;

                // Animación de confirmación
                this.style.transform = 'scale(1.3)';
                setTimeout(() => { this.style.transform = 'scale(1)'; }, 200);
            });

            // Resalta temporalmente las estrellas hasta la seleccionada al pasar el cursor.
            star.addEventListener('mouseenter', function() {
                const value = parseInt(this.dataset.value);
                stars.forEach((s, i) => {
                    s.style.color = i < value ? '#f0b429' : '#ddd';
                });
            });

            // Al salir el cursor, restaura el color según la puntuación seleccionada.
            star.addEventListener('mouseleave', function() {
                stars.forEach((s, i) => {
                    s.style.color = i < currentRating ? '#f0b429' : '#ddd';
                });
            });
        });

        

        // Convierte texto en contenido HTML seguro antes de insertarlo en la página.
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Añade la clase visible a los elementos cuando entran en la pantalla.
        function observeFadeIns() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        }

        // Espera a que exista el HTML para cargar los PDF y activar las animaciones.
        document.addEventListener('DOMContentLoaded', () => {
            loadProjects();
            observeFadeIns();
        });