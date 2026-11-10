const DOWNLOAD_REGISTRATION_FORM =
    'https://docs.google.com/forms/d/e/1FAIpQLScANbRpoVNZ0ywNdoHgXqQ61UAhk2oL9sC5ncrJ0Hw66h4Z_Q/viewform';

        // Muestra el formulario para registrarse y regresar a la página de documentos.
        function renderDocumentAccess() {
            const grid = document.getElementById('projectsGrid');
            if (!grid) return;

            grid.innerHTML = `
                <article class="project-card fade-in">
                    <div class="project-body">
                        <span class="project-category">Registro de descargas</span>
                        <h3>Regístrate para consultar los documentos</h3>
                        <p>Completa el formulario y luego abre la página con las tarjetas de los PDF.</p>
                        <a class="project-pdf-link" href="${DOWNLOAD_REGISTRATION_FORM}" target="_blank" rel="noopener">Ir al formulario de registro</a>
                    </div>
                </article>
            `;
            observeFadeIns();
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

        // Espera a que exista el HTML para mostrar el formulario y activar las animaciones.
        document.addEventListener('DOMContentLoaded', () => {
            renderDocumentAccess();
            observeFadeIns();
        });