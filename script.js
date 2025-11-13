// ===== VARIABLES GLOBALES =====
let simulationActive = true;
let updateCount = 0;
let startTime = Date.now();
let charts = {};
let tickets = [];
let risks = [];
let changes = [];
let improvements = [];
let users = [];
let historicalData = [];

// Datos para predicción
let predictionHistory = [];

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    initializeSystem();
    setupEventListeners();
    setupTableClickListeners();
    startSimulation();
    initializeCharts();
    generateInitialData();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// ===== CONFIGURACIÓN DE EVENTOS =====
function setupEventListeners() {
    // Navegación del menú
    document.querySelectorAll('.nav-menu li').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            showSection(section);
            document.querySelectorAll('.nav-menu li').forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            addLog(`Navegando a sección: ${section}`, 'info');
            showNotification(`Sección ${section} activada`, 'info');
        });
    });

    // Toggle tema
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Control de simulación
    document.getElementById('btnToggleSimulation').addEventListener('click', toggleSimulation);

    // Filtros de tickets
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            filterTickets(filter);
            addLog(`Filtro aplicado: ${filter}`, 'info');
        });
    });

    // Clicks en tarjetas de estadísticas
    setupStatCardListeners();
    
    // Clicks en servicios del catálogo
    setupCatalogListeners();
    
    // Clicks en learning cards
    setupLearningListeners();
    
    // Clicks en usuarios
    setupUserListeners();
    
    // Clicks en mejoras
    setupImprovementListeners();
    
    // Clicks en gráficos
    setupChartClickListeners();
}

// ===== LISTENERS PARA TARJETAS DE ESTADÍSTICAS =====
function setupStatCardListeners() {
    document.addEventListener('click', (e) => {
        const statCard = e.target.closest('.stat-card');
        if (statCard) {
            const title = statCard.querySelector('p').textContent;
            const value = statCard.querySelector('h3').textContent;
            showDetailModal('Estadística Detallada', `
                <h3>${title}</h3>
                <p class="stat-value">${value}</p>
                <div class="stat-details">
                    <p><strong>Último Actualizado:</strong> ${new Date().toLocaleString('es-ES')}</p>
                    <p><strong>Tendencia:</strong> ${Math.random() > 0.5 ? '📈 Mejorando' : '📊 Estable'}</p>
                    <p><strong>Objetivo:</strong> ${randomBetween(90, 100)}%</p>
                    <p><strong>Desempeño:</strong> ${randomBetween(85, 95)}%</p>
                </div>
            `);
            addLog(`Vista detallada: ${title}`, 'info');
        }
    });
}

// ===== LISTENERS PARA CATÁLOGO DE SERVICIOS =====
function setupCatalogListeners() {
    document.addEventListener('click', (e) => {
        const serviceItem = e.target.closest('.service-item');
        if (serviceItem) {
            const name = serviceItem.querySelector('h4').textContent;
            const desc = serviceItem.querySelector('p').textContent;
            showDetailModal(`Servicio: ${name}`, `
                <div class="service-detail">
                    <p><strong>Descripción:</strong> ${desc}</p>
                    <p><strong>Estado:</strong> <span class="badge badge-success">Operativo</span></p>
                    <p><strong>Disponibilidad:</strong> ${randomBetween(95, 99.9).toFixed(1)}%</p>
                    <p><strong>Usuarios Activos:</strong> ${randomBetween(50, 500)}</p>
                    <p><strong>SLA:</strong> ${randomBetween(95, 99)}% de disponibilidad</p>
                    <p><strong>Tiempo Respuesta:</strong> ${randomBetween(5, 30)} minutos</p>
                    <p><strong>Última Actualización:</strong> ${new Date(Date.now() - randomBetween(1, 30) * 86400000).toLocaleDateString('es-ES')}</p>
                </div>
            `);
            addLog(`Consultando servicio: ${name}`, 'info');
        }
    });
}

// ===== LISTENERS PARA LEARNING CARDS =====
function setupLearningListeners() {
    document.addEventListener('click', (e) => {
        const learningCard = e.target.closest('.learning-card');
        if (learningCard) {
            const title = learningCard.querySelector('h4').textContent;
            const content = getLearningContent(title);
            showDetailModal(`Aprendizaje: ${title}`, content);
            addLog(`Consultando información: ${title}`, 'info');
        }
    });
}

function getLearningContent(title) {
    const contents = {
        'ITIL v4': `
            <div class="learning-detail">
                <h4>ITIL v4 - Framework de Gestión de Servicios TI</h4>
                <p><strong>Definición:</strong> ITIL (Information Technology Infrastructure Library) es un conjunto de prácticas para la gestión de servicios de TI.</p>
                <h5>Componentes Principales:</h5>
                <ul>
                    <li><strong>Sistema de Valor del Servicio (SVS)</strong>: Modelo operativo integral</li>
                    <li><strong>Cadena de Valor del Servicio</strong>: Actividades clave para crear valor</li>
                    <li><strong>Prácticas ITIL</strong>: 34 prácticas de gestión</li>
                    <li><strong>Principios Guía</strong>: 7 principios fundamentales</li>
                    <li><strong>Mejora Continua</strong>: Modelo de mejora iterativa</li>
                </ul>
                <p><strong>Beneficios:</strong> Mejora la eficiencia, reduce costos, aumenta la satisfacción del cliente</p>
                <p><strong>Certificación:</strong> Foundation, Practitioner, Managing Professional, Strategic Leader</p>
            </div>
        `,
        'ISO 20000': `
            <div class="learning-detail">
                <h4>ISO 20000 - Gestión de Servicios TI</h4>
                <p><strong>Definición:</strong> Primera norma internacional específica para la gestión de servicios de TI.</p>
                <h5>Estructura:</h5>
                <ul>
                    <li><strong>Parte 1:</strong> Requisitos del sistema de gestión</li>
                    <li><strong>Parte 2:</strong> Guía para la aplicación</li>
                    <li><strong>Planificación y diseño</strong> de servicios nuevos o modificados</li>
                    <li><strong>Transición del servicio</strong></li>
                    <li><strong>Entrega del servicio</strong></li>
                    <li><strong>Procesos de relación</strong></li>
                    <li><strong>Procesos de control</strong></li>
                </ul>
                <p><strong>Objetivo:</strong> Asegurar que los servicios TI cumplan con las necesidades del negocio</p>
                <p><strong>Alcance:</strong> Aplicable a organizaciones de cualquier tamaño</p>
            </div>
        `,
        'ISO 27001': `
            <div class="learning-detail">
                <h4>ISO 27001 - Seguridad de la Información</h4>
                <p><strong>Definición:</strong> Norma internacional para Sistemas de Gestión de Seguridad de la Información (SGSI).</p>
                <h5>Dominios Principales:</h5>
                <ul>
                    <li><strong>Políticas de seguridad</strong></li>
                    <li><strong>Organización de la seguridad</strong></li>
                    <li><strong>Seguridad de recursos humanos</strong></li>
                    <li><strong>Gestión de activos</strong></li>
                    <li><strong>Control de acceso</strong></li>
                    <li><strong>Criptografía</strong></li>
                    <li><strong>Seguridad física y ambiental</strong></li>
                    <li><strong>Seguridad de operaciones</strong></li>
                    <li><strong>Seguridad de comunicaciones</strong></li>
                    <li><strong>Gestión de incidentes</strong></li>
                </ul>
                <p><strong>Controles:</strong> 114 controles organizados en 14 dominios (Anexo A)</p>
                <p><strong>CIA Triad:</strong> Confidencialidad, Integridad, Disponibilidad</p>
            </div>
        `,
        'ISO 31000': `
            <div class="learning-detail">
                <h4>ISO 31000 - Gestión de Riesgos</h4>
                <p><strong>Definición:</strong> Norma internacional que proporciona principios y directrices genéricas para la gestión de riesgos.</p>
                <h5>Principios Clave:</h5>
                <ul>
                    <li><strong>Integrada:</strong> Parte integral de todas las actividades organizacionales</li>
                    <li><strong>Estructurada y completa</strong></li>
                    <li><strong>Personalizada:</strong> Adaptada al contexto de la organización</li>
                    <li><strong>Inclusiva:</strong> Participación de stakeholders</li>
                    <li><strong>Dinámica:</strong> Responde a cambios</li>
                    <li><strong>Mejor información disponible</strong></li>
                    <li><strong>Factores humanos y culturales</strong></li>
                    <li><strong>Mejora continua</strong></li>
                </ul>
                <h5>Proceso de Gestión:</h5>
                <ol>
                    <li>Comunicación y consulta</li>
                    <li>Establecimiento del contexto</li>
                    <li>Identificación de riesgos</li>
                    <li>Análisis de riesgos</li>
                    <li>Evaluación de riesgos</li>
                    <li>Tratamiento de riesgos</li>
                    <li>Monitoreo y revisión</li>
                </ol>
            </div>
        `
    };
    return contents[title] || '<p>Información no disponible</p>';
}

// ===== LISTENERS PARA USUARIOS =====
function setupUserListeners() {
    document.addEventListener('click', (e) => {
        const row = e.target.closest('#tablaUsuarios tr');
        if (row && row.parentElement.tagName === 'TBODY') {
            const cells = row.cells;
            const userName = cells[0].textContent;
            const userRole = cells[1].textContent;
            const userArea = cells[2].textContent;
            
            showDetailModal(`Usuario: ${userName}`, `
                <div class="user-detail">
                    <p><strong>Nombre:</strong> ${userName}</p>
                    <p><strong>Rol:</strong> ${userRole}</p>
                    <p><strong>Área:</strong> ${userArea}</p>
                    <p><strong>Email:</strong> ${userName.toLowerCase().replace(' ', '.')}@empresa.com</p>
                    <p><strong>Teléfono:</strong> +51 ${randomBetween(900000000, 999999999)}</p>
                    <p><strong>Tickets Asignados:</strong> ${randomBetween(5, 25)}</p>
                    <p><strong>Tickets Resueltos:</strong> ${randomBetween(50, 200)}</p>
                    <p><strong>Tasa de Resolución:</strong> ${randomBetween(85, 98)}%</p>
                    <p><strong>Última Actividad:</strong> ${new Date(Date.now() - randomBetween(1, 60) * 60000).toLocaleString('es-ES')}</p>
                </div>
            `);
            addLog(`Consultando usuario: ${userName}`, 'info');
        }
    });
}

// ===== LISTENERS PARA MEJORAS =====
function setupImprovementListeners() {
    document.addEventListener('click', (e) => {
        const improvementItem = e.target.closest('.improvement-item');
        if (improvementItem) {
            const title = improvementItem.querySelector('h4').textContent;
            const priority = improvementItem.querySelector('.badge').textContent;
            
            showDetailModal(`Mejora: ${title}`, `
                <div class="improvement-detail">
                    <h4>${title}</h4>
                    <p><strong>Prioridad:</strong> <span class="badge badge-${getPriorityClass(priority)}">${priority}</span></p>
                    <p><strong>Estado:</strong> ${Math.random() > 0.5 ? 'Planificada' : 'En Evaluación'}</p>
                    <p><strong>Beneficio Esperado:</strong> ${randomBetween(10, 30)}% de mejora</p>
                    <p><strong>Costo Estimado:</strong> ${randomBetween(5000, 50000).toLocaleString()}</p>
                    <p><strong>Tiempo Implementación:</strong> ${randomBetween(2, 12)} semanas</p>
                    <p><strong>Responsable:</strong> ${['Juan Pérez', 'María García', 'Carlos López'][randomBetween(0, 2)]}</p>
                    <p><strong>ROI Proyectado:</strong> ${randomBetween(150, 300)}%</p>
                </div>
            `);
            addLog(`Consultando mejora: ${title}`, 'info');
        }
    });
}

// ===== CLICKS EN TABLAS DE TICKETS Y RIESGOS =====
function setupTableClickListeners() {
    // Tickets
    document.addEventListener('click', (e) => {
        const ticketRow = e.target.closest('#tablaTickets tr');
        if (ticketRow && ticketRow.parentElement.tagName === 'TBODY') {
            const cells = ticketRow.cells;
            const ticketId = cells[0].textContent;
            const ticket = tickets.find(t => t.id === ticketId);
            
            if (ticket) {
                showDetailModal(`Ticket: ${ticket.id}`, `
                    <div class="ticket-detail">
                        <h4>${ticket.title}</h4>
                        <p><strong>ID:</strong> ${ticket.id}</p>
                        <p><strong>Prioridad:</strong> <span class="badge badge-${getPriorityClass(ticket.priority)}">${ticket.priority}</span></p>
                        <p><strong>Estado:</strong> <span class="badge badge-${getStatusClass(ticket.status)}">${ticket.status}</span></p>
                        <p><strong>Asignado a:</strong> ${ticket.assignee}</p>
                        <p><strong>Fecha Creación:</strong> ${ticket.date}</p>
                        <p><strong>Tiempo de Resolución:</strong> ${ticket.resolvedTime}h</p>
                        <p><strong>Descripción:</strong> Incidencia reportada que requiere atención del equipo técnico.</p>
                        <p><strong>Categoría:</strong> ${['Hardware', 'Software', 'Red', 'Acceso', 'Datos'][randomBetween(0, 4)]}</p>
                        <p><strong>Impacto:</strong> ${['Bajo', 'Medio', 'Alto'][randomBetween(0, 2)]}</p>
                    </div>
                `);
                addLog(`Consultando ticket: ${ticket.id}`, 'info');
            }
        }
    });

    // Riesgos
    document.addEventListener('click', (e) => {
        const riskRow = e.target.closest('#tablaRiesgos tr');
        if (riskRow && riskRow.parentElement.tagName === 'TBODY') {
            const cells = riskRow.cells;
            const riskId = cells[0].textContent;
            const risk = risks.find(r => r.id === riskId);
            
            if (risk) {
                showDetailModal(`Riesgo: ${risk.id}`, `
                    <div class="risk-detail">
                        <h4>${risk.description}</h4>
                        <p><strong>ID:</strong> ${risk.id}</p>
                        <p><strong>Categoría:</strong> ${risk.category}</p>
                        <p><strong>Impacto:</strong> <span class="badge badge-${getImpactClass(risk.impact)}">${risk.impact}</span></p>
                        <p><strong>Probabilidad:</strong> ${risk.probability}</p>
                        <p><strong>Nivel:</strong> <span class="badge badge-${getRiskLevelClass(risk.level)}">${risk.level}</span></p>
                        <p><strong>Estrategia de Mitigación:</strong> ${['Evitar', 'Transferir', 'Mitigar', 'Aceptar'][randomBetween(0, 3)]}</p>
                        <p><strong>Controles Actuales:</strong> ${randomBetween(1, 5)} controles implementados</p>
                        <p><strong>Responsable:</strong> ${['Juan Pérez', 'María García', 'Ana Martínez'][randomBetween(0, 2)]}</p>
                        <p><strong>Fecha Identificación:</strong> ${new Date(Date.now() - randomBetween(1, 90) * 86400000).toLocaleDateString('es-ES')}</p>
                    </div>
                `);
                addLog(`Consultando riesgo: ${risk.id}`, 'info');
            }
        }
    });
}

// ===== MODAL DE DETALLES =====
function showDetailModal(title, content) {
    // Crear modal si no existe
    let modal = document.getElementById('detailModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'detailModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2 id="modalTitle"></h2>
                <div id="modalBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Cerrar modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    modal.style.display = 'flex';
}

// ===== LISTENERS PARA GRÁFICOS =====
function setupChartClickListeners() {
    // Se ejecutará después de inicializar los gráficos
    setTimeout(() => {
        // Click en gráfico de fases
        if (charts.fases) {
            document.getElementById('chartFases').onclick = (evt) => {
                const points = charts.fases.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
                if (points.length) {
                    const firstPoint = points[0];
                    const label = charts.fases.data.labels[firstPoint.index];
                    const value = charts.fases.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
                    showDetailModal(`Rendimiento: ${label}`, `
                        <div class="chart-detail">
                            <h3>${label}</h3>
                            <p class="stat-value">${value}%</p>
                            <p><strong>Estado:</strong> ${value >= 85 ? '✅ Excelente' : value >= 70 ? '⚠️ Aceptable' : '❌ Requiere Atención'}</p>
                            <p><strong>Objetivo:</strong> 90%</p>
                            <p><strong>Brecha:</strong> ${Math.max(0, 90 - value)}%</p>
                            <p><strong>Tendencia:</strong> ${Math.random() > 0.5 ? '📈 Mejorando' : '📉 Estable'}</p>
                            <p><strong>Acciones Recomendadas:</strong></p>
                            <ul>
                                <li>Revisar procesos de ${label.toLowerCase()}</li>
                                <li>Capacitar al equipo</li>
                                <li>Optimizar recursos asignados</li>
                            </ul>
                        </div>
                    `);
                    addLog(`Consultando rendimiento de fase: ${label}`, 'info');
                }
            };
        }

        // Click en gráfico de servicios
        if (charts.servicios) {
            document.getElementById('chartServicios').onclick = (evt) => {
                const points = charts.servicios.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
                if (points.length) {
                    const firstPoint = points[0];
                    const label = charts.servicios.data.labels[firstPoint.index];
                    const value = charts.servicios.data.datasets[0].data[firstPoint.index];
                    showDetailModal(`Servicio: ${label}`, `
                        <div class="chart-detail">
                            <h3>${label}</h3>
                            <p><strong>Distribución:</strong> ${value}%</p>
                            <p><strong>Usuarios Activos:</strong> ${randomBetween(100, 1000)}</p>
                            <p><strong>Disponibilidad:</strong> ${randomBetween(95, 99.9).toFixed(1)}%</p>
                            <p><strong>Incidencias Mensuales:</strong> ${randomBetween(2, 15)}</p>
                            <p><strong>Satisfacción:</strong> ${randomBetween(80, 95)}%</p>
                            <p><strong>Costo Mensual:</strong> ${randomBetween(5000, 25000).toLocaleString()}</p>
                        </div>
                    `);
                    addLog(`Consultando distribución de servicio: ${label}`, 'info');
                }
            };
        }

        // Click en gráfico de tickets
        if (charts.tickets) {
            document.getElementById('chartTickets').onclick = (evt) => {
                const points = charts.tickets.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
                if (points.length) {
                    const firstPoint = points[0];
                    const label = charts.tickets.data.labels[firstPoint.index];
                    const dataset = charts.tickets.data.datasets[firstPoint.datasetIndex];
                    const value = dataset.data[firstPoint.index];
                    showDetailModal(`Tickets ${dataset.label} - ${label}`, `
                        <div class="chart-detail">
                            <h3>${dataset.label} en ${label}</h3>
                            <p class="stat-value">${value}</p>
                            <p><strong>Tipo:</strong> ${dataset.label}</p>
                            <p><strong>Periodo:</strong> ${label}</p>
                            <p><strong>Promedio Diario:</strong> ${(value / 4).toFixed(1)} tickets</p>
                            <p><strong>Tendencia vs Hora Anterior:</strong> ${Math.random() > 0.5 ? '+' : '-'}${randomBetween(5, 15)}%</p>
                            <p><strong>Personal Asignado:</strong> ${randomBetween(3, 8)} técnicos</p>
                        </div>
                    `);
                    addLog(`Consultando evolución de tickets: ${dataset.label} - ${label}`, 'info');
                }
            };
        }

        // Click en gráfico de mejora
        if (charts.mejora) {
            document.getElementById('chartMejora').onclick = (evt) => {
                const points = charts.mejora.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
                if (points.length) {
                    const firstPoint = points[0];
                    const label = charts.mejora.data.labels[firstPoint.index];
                    const value = charts.mejora.data.datasets[0].data[firstPoint.index];
                    showDetailModal(`Índice de Mejora - ${label}`, `
                        <div class="chart-detail">
                            <h3>Mejora Continua - ${label}</h3>
                            <p class="stat-value">${value}</p>
                            <p><strong>Crecimiento Mensual:</strong> +${randomBetween(3, 8)} puntos</p>
                            <p><strong>Mejoras Implementadas:</strong> ${randomBetween(5, 15)}</p>
                            <p><strong>Ideas en Evaluación:</strong> ${randomBetween(8, 20)}</p>
                            <p><strong>Impacto en Satisfacción:</strong> +${randomBetween(2, 7)}%</p>
                            <p><strong>ROI de Mejoras:</strong> ${randomBetween(150, 300)}%</p>
                            <p><strong>Próxima Revisión:</strong> ${new Date(Date.now() + randomBetween(7, 30) * 86400000).toLocaleDateString('es-ES')}</p>
                        </div>
                    `);
                    addLog(`Consultando índice de mejora: ${label}`, 'info');
                }
            };
        }
    }, 1000);
}

// ===== SISTEMA DE NAVEGACIÓN =====
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // Actualizar gráficos al cambiar de sección
    setTimeout(() => {
        Object.values(charts).forEach(chart => {
            if (chart) chart.resize();
        });
    }, 300);
}

// ===== TEMA CLARO/OSCURO =====
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    
    const icon = document.querySelector('#themeToggle i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Actualizar colores de gráficos
    updateChartsTheme();
}

// ===== FECHA Y HORA =====
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('es-ES', options);
}

// ===== INICIALIZACIÓN DEL SISTEMA =====
function initializeSystem() {
    addLog('Sistema SIGS-TI iniciado correctamente', 'success');
    createParticles();
}

// ===== PARTÍCULAS DE FONDO =====
function createParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#3498db';
        ctx.globalAlpha = 0.5;
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== GENERACIÓN DE DATOS INICIALES =====
function generateInitialData() {
    // Tickets iniciales
    for (let i = 0; i < 10; i++) {
        generateTicket();
    }
    
    // Riesgos iniciales
    for (let i = 0; i < 8; i++) {
        generateRisk();
    }
    
    // Cambios iniciales
    for (let i = 0; i < 5; i++) {
        generateChange();
    }
    
    // Mejoras iniciales
    for (let i = 0; i < 6; i++) {
        generateImprovement();
    }
    
    // Usuarios iniciales
    generateUsers();
    
    // Datos históricos
    for (let i = 0; i < 6; i++) {
        historicalData.push({
            month: getMonthName(i),
            satisfaccion: randomBetween(80, 95),
            rendimiento: randomBetween(75, 95),
            disponibilidad: randomBetween(95, 99.9)
        });
    }
    
    updateAllDisplays();
}

// ===== SIMULACIÓN AUTOMÁTICA =====
function startSimulation() {
    setInterval(() => {
        if (!simulationActive) return;
        
        updateCount++;
        updateElapsedTime();
        
        // Actualizar métricas globales
        updateGlobalMetrics();
        
        // Generar nuevos eventos aleatorios
        if (Math.random() > 0.7) generateTicket();
        if (Math.random() > 0.85) generateRisk();
        if (Math.random() > 0.8) generateChange();
        
        // Actualizar estados de tickets existentes
        updateTicketStates();
        
        // Actualizar displays
        updateAllDisplays();
        
        // Actualizar gráficos
        updateAllCharts();
        
        // Agregar log
        addLog(`Actualización automática #${updateCount} ejecutada`, 'info');
        
        // Notificación ocasional
        if (Math.random() > 0.9) {
            showNotification('Nuevo evento del sistema detectado', 'info');
        }
        
        // Actualizar predicción
        updatePrediction();
        
    }, 5000); // Cada 5 segundos
}

// ===== CONTROL DE SIMULACIÓN =====
function toggleSimulation() {
    simulationActive = !simulationActive;
    const btn = document.getElementById('btnToggleSimulation');
    const status = document.getElementById('simulationStatus');
    
    if (simulationActive) {
        btn.innerHTML = '<i class="fas fa-pause"></i> Pausar Simulación';
        btn.classList.add('active');
        status.textContent = 'Activa';
        status.className = 'status-active';
        addLog('Simulación reanudada', 'success');
    } else {
        btn.innerHTML = '<i class="fas fa-play"></i> Reanudar Simulación';
        btn.classList.remove('active');
        status.textContent = 'Pausada';
        status.className = 'status-paused';
        addLog('Simulación pausada', 'warning');
    }
}

// ===== TIEMPO TRANSCURRIDO =====
function updateElapsedTime() {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    document.getElementById('elapsedTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('updateCount').textContent = updateCount;
}

// ===== GENERADORES DE DATOS =====
function generateTicket() {
    const titles = [
        'Error en servidor de aplicaciones',
        'Solicitud de acceso a sistema',
        'Problema de conectividad de red',
        'Actualización de software requerida',
        'Fallo en base de datos',
        'Incidencia en servicio de correo',
        'Configuración de firewall',
        'Respaldo de información',
        'Mantenimiento preventivo',
        'Optimización de rendimiento'
    ];
    
    const priorities = ['Alta', 'Media', 'Baja'];
    const statuses = ['Abierto', 'En Proceso', 'Cerrado'];
    const assignees = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez'];
    
    const ticket = {
        id: `TK-${1000 + tickets.length}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        assignee: assignees[Math.floor(Math.random() * assignees.length)],
        date: new Date().toLocaleString('es-ES'),
        resolvedTime: randomBetween(1, 8)
    };
    
    tickets.push(ticket);
    
    // Mantener solo los últimos 50 tickets
    if (tickets.length > 50) {
        tickets.shift();
    }
    
    // Notificación de nuevo ticket
    if (Math.random() > 0.8) {
        showNotification(`Nuevo ticket creado: ${ticket.id}`, 'info');
        playSound('notification');
    }
}

function generateRisk() {
    const descriptions = [
        'Vulnerabilidad de seguridad detectada',
        'Riesgo de pérdida de datos',
        'Fallo potencial en infraestructura',
        'Incumplimiento de política de acceso',
        'Sobrecarga del sistema',
        'Dependencia de proveedor único',
        'Falta de respaldos actualizados',
        'Exposición de información sensible'
    ];
    
    const categories = ['Seguridad', 'Operacional', 'Estratégico', 'Cumplimiento', 'Financiero'];
    const impacts = ['Bajo', 'Medio', 'Alto', 'Crítico'];
    const probabilities = ['Baja', 'Media', 'Alta'];
    
    const impact = impacts[Math.floor(Math.random() * impacts.length)];
    const probability = probabilities[Math.floor(Math.random() * probabilities.length)];
    
    const risk = {
        id: `RK-${100 + risks.length}`,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        impact: impact,
        probability: probability,
        level: calculateRiskLevel(impact, probability)
    };
    
    risks.push(risk);
    
    if (risks.length > 30) {
        risks.shift();
    }
}

function generateChange() {
    const versions = ['v2.1.0', 'v2.1.1', 'v2.2.0', 'v2.3.0', 'v3.0.0'];
    const responsibles = ['Equipo DevOps', 'Equipo Backend', 'Equipo Frontend', 'Equipo QA', 'Equipo Infraestructura'];
    const statuses = ['Aprobado', 'Prueba en curso', 'Completado', 'Pendiente'];
    
    const change = {
        version: versions[Math.floor(Math.random() * versions.length)],
        date: new Date().toLocaleString('es-ES'),
        responsible: responsibles[Math.floor(Math.random() * responsibles.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)]
    };
    
    changes.push(change);
    
    if (changes.length > 20) {
        changes.shift();
    }
}

function generateImprovement() {
    const ideas = [
        'Automatizar proceso de respaldos',
        'Implementar monitoreo proactivo',
        'Mejorar documentación técnica',
        'Optimizar tiempos de respuesta',
        'Capacitación del equipo en nuevas tecnologías',
        'Actualizar infraestructura de red',
        'Implementar metodología DevOps',
        'Reforzar medidas de seguridad'
    ];
    
    const priorities = ['Alta', 'Media', 'Baja'];
    
    const improvement = {
        id: `MJ-${100 + improvements.length}`,
        idea: ideas[Math.floor(Math.random() * ideas.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        date: new Date().toLocaleDateString('es-ES')
    };
    
    improvements.push(improvement);
    
    if (improvements.length > 15) {
        improvements.shift();
    }
}

function generateUsers() {
    users = [
        { name: 'Juan Pérez', role: 'Administrador', area: 'TI', status: 'Activo' },
        { name: 'María García', role: 'Analista', area: 'Desarrollo', status: 'Activo' },
        { name: 'Carlos López', role: 'Operador', area: 'Soporte', status: 'Activo' },
        { name: 'Ana Martínez', role: 'Auditor', area: 'Seguridad', status: 'Activo' },
        { name: 'Luis Rodríguez', role: 'Gerente', area: 'TI', status: 'Activo' }
    ];
}

// ===== ACTUALIZACIÓN DE ESTADOS =====
function updateTicketStates() {
    tickets.forEach(ticket => {
        if (Math.random() > 0.9) {
            const statuses = ['Abierto', 'En Proceso', 'Cerrado'];
            const currentIndex = statuses.indexOf(ticket.status);
            if (currentIndex < statuses.length - 1) {
                ticket.status = statuses[currentIndex + 1];
            }
        }
    });
}

// ===== MÉTRICAS GLOBALES =====
function updateGlobalMetrics() {
    const totalTickets = tickets.length;
    const closedTickets = tickets.filter(t => t.status === 'Cerrado').length;
    const openTickets = tickets.filter(t => t.status === 'Abierto').length;
    const processingTickets = tickets.filter(t => t.status === 'En Proceso').length;
    const avgTime = tickets.reduce((sum, t) => sum + t.resolvedTime, 0) / tickets.length || 0;
    const satisfaction = randomBetween(85, 98);
    
    // Dashboard general
    animateNumber('totalTickets', totalTickets);
    animateNumber('ticketsCerrados', closedTickets);
    document.getElementById('tiempoPromedio').textContent = `${avgTime.toFixed(1)}h`;
    animateNumber('satisfaccionGlobal', satisfaction, '%');
    
    // Operación
    animateNumber('ticketsAbiertos', openTickets);
    animateNumber('ticketsProceso', processingTickets);
    animateNumber('ticketsResueltos', closedTickets);
    document.getElementById('tiempoResolucion').textContent = `${avgTime.toFixed(1)}h`;
    
    // Semáforo de rendimiento
    updateTrafficLight(satisfaction);
    
    // Progreso global
    const globalProgress = randomBetween(75, 95);
    updateProgressBar('progressGlobal', 'progressGlobalText', globalProgress);
    
    // Guardar para predicción
    predictionHistory.push({
        time: Date.now(),
        satisfaction: satisfaction,
        performance: globalProgress,
        tickets: totalTickets
    });
    
    // Mantener solo los últimos 10
    if (predictionHistory.length > 10) {
        predictionHistory.shift();
    }
}

// ===== ACTUALIZACIÓN DE TODOS LOS DISPLAYS =====
function updateAllDisplays() {
    updateTicketsTable();
    updateRisksTable();
    updateVersionsTable();
    updateUsersTable();
    updatePlanningTable();
    updateRiskDesignTable();
    updateChangesLog();
    updateImprovementsList();
    updateCatalog();
    updateTimeline();
    updateDeploymentStatus();
    updateSecurityAlerts();
    updateMejoraMetrics();
    updateSeguridadMetrics();
    updateRiesgosMetrics();
    updatePlanificacionMetrics();
    updateRiskHeatmap(); // Actualizar matriz de calor dinámica
}

// ===== TABLAS =====
function updateTicketsTable() {
    const tbody = document.getElementById('tablaTickets');
    tbody.innerHTML = '';
    
    tickets.slice(-20).reverse().forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${ticket.id}</strong></td>
            <td>${ticket.title}</td>
            <td><span class="badge badge-${getPriorityClass(ticket.priority)}">${ticket.priority}</span></td>
            <td><span class="badge badge-${getStatusClass(ticket.status)}">${ticket.status}</span></td>
            <td>${ticket.assignee}</td>
            <td>${ticket.date}</td>
        `;
        tbody.appendChild(row);
    });
}

function updateRiskDesignTable() {
    const tbody = document.getElementById('tablaRiesgosDiseno');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const designRisks = [
        { risk: 'Falta de escalabilidad', impact: 'Alto', probability: 'Media', level: 'Alto' },
        { risk: 'Dependencia tecnológica', impact: 'Medio', probability: 'Alta', level: 'Alto' },
        { risk: 'Complejidad excesiva', impact: 'Medio', probability: 'Media', level: 'Medio' },
        { risk: 'Incompatibilidad de sistemas', impact: 'Bajo', probability: 'Baja', level: 'Bajo' }
    ];
    
    designRisks.forEach(risk => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${risk.risk}</td>
            <td><span class="badge badge-${getImpactClass(risk.impact)}">${risk.impact}</span></td>
            <td>${risk.probability}</td>
            <td><span class="badge badge-${getRiskLevelClass(risk.level)}">${risk.level}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// ===== OTROS DISPLAYS =====
function updateChangesLog() {
    const container = document.getElementById('changesLog');
    if (!container) return;
    container.innerHTML = '';
    
    changes.slice(-5).reverse().forEach(change => {
        const item = document.createElement('div');
        item.className = 'change-item';
        item.innerHTML = `
            <h4>${change.version}</h4>
            <p><i class="fas fa-user"></i> ${change.responsible} | <i class="fas fa-calendar"></i> ${change.date}</p>
            <p><strong>Estado:</strong> <span class="badge badge-${getChangeStatusClass(change.status)}">${change.status}</span></p>
        `;
        container.appendChild(item);
    });
}

function updateImprovementsList() {
    const container = document.getElementById('listaIdeas');
    if (!container) return;
    container.innerHTML = '';
    
    improvements.slice(-8).reverse().forEach(improvement => {
        const item = document.createElement('div');
        item.className = 'improvement-item';
        item.innerHTML = `
            <h4>${improvement.idea}</h4>
            <p><strong>Prioridad:</strong> <span class="badge badge-${getPriorityClass(improvement.priority)}">${improvement.priority}</span> | 
            <i class="fas fa-calendar"></i> ${improvement.date}</p>
        `;
        container.appendChild(item);
    });
}

function updateCatalog() {
    const container = document.getElementById('catalogoServicios');
    if (!container) return;
    container.innerHTML = '';
    
    const services = [
        { name: 'Correo Electrónico', icon: 'fa-envelope', desc: 'Servicio de mensajería corporativa' },
        { name: 'Almacenamiento', icon: 'fa-database', desc: 'Gestión de archivos en la nube' },
        { name: 'VPN', icon: 'fa-shield-alt', desc: 'Acceso remoto seguro' },
        { name: 'Helpdesk', icon: 'fa-headset', desc: 'Soporte técnico 24/7' },
        { name: 'Videoconferencia', icon: 'fa-video', desc: 'Reuniones virtuales' },
        { name: 'Backup', icon: 'fa-save', desc: 'Respaldos automáticos' }
    ];
    
    services.forEach(service => {
        const item = document.createElement('div');
        item.className = 'service-item';
        item.innerHTML = `
            <i class="fas ${service.icon}"></i>
            <h4>${service.name}</h4>
            <p>${service.desc}</p>
        `;
        container.appendChild(item);
    });
}

function updateTimeline() {
    const container = document.getElementById('timeline');
    if (!container) return;
    container.innerHTML = '';
    
    const events = [
        { title: 'Inicio del Proyecto', date: 'Enero 2025', status: 'completado' },
        { title: 'Fase de Análisis', date: 'Febrero 2025', status: 'completado' },
        { title: 'Desarrollo', date: 'Marzo 2025', status: 'en-proceso' },
        { title: 'Pruebas', date: 'Abril 2025', status: 'pendiente' },
        { title: 'Despliegue', date: 'Mayo 2025', status: 'pendiente' }
    ];
    
    events.forEach(event => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <h4>${event.title}</h4>
            <p><i class="fas fa-calendar"></i> ${event.date}</p>
        `;
        container.appendChild(item);
    });
}

function updateDeploymentStatus() {
    const bar = document.getElementById('deploymentBar');
    const text = document.getElementById('deploymentText');
    if (!bar || !text) return;
    
    const progress = randomBetween(60, 95);
    bar.style.width = `${progress}%`;
    
    const statuses = ['Iniciando...', 'Verificando dependencias...', 'Compilando...', 'Desplegando...', 'Casi completado...'];
    text.textContent = statuses[Math.floor((progress / 100) * statuses.length)];
    
    // Agregar alertas
    const alertsContainer = document.getElementById('statusAlerts');
    if (!alertsContainer) return;
    
    if (alertsContainer.children.length === 0 || Math.random() > 0.95) {
        const alertTypes = ['success', 'warning'];
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const messages = {
            success: ['Prueba unitaria completada', 'Validación de integridad exitosa', 'Despliegue en ambiente de prueba OK'],
            warning: ['Advertencia: Recursos limitados', 'Atención: Revisar logs', 'Monitorear rendimiento']
        };
        
        const alert = document.createElement('div');
        alert.className = `status-alert ${alertType}`;
        alert.innerHTML = `<i class="fas fa-${alertType === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i> 
                          <span>${messages[alertType][Math.floor(Math.random() * messages[alertType].length)]}</span>`;
        alertsContainer.appendChild(alert);
        
        if (alertsContainer.children.length > 5) {
            alertsContainer.removeChild(alertsContainer.firstChild);
        }
    }
}

function updateSecurityAlerts() {
    const container = document.getElementById('securityAlerts');
    if (!container) return;
    
    if (container.children.length === 0 || Math.random() > 0.92) {
        const alertTypes = ['critical', 'low'];
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const messages = {
            critical: ['Intento de acceso no autorizado detectado', 'Actualización de seguridad pendiente'],
            low: ['Auditoría de seguridad programada', 'Renovación de certificados completada']
        };
        
        const alert = document.createElement('div');
        alert.className = `security-alert ${alertType}`;
        alert.innerHTML = `<i class="fas fa-${alertType === 'critical' ? 'exclamation-circle' : 'info-circle'}"></i> 
                          <span>${messages[alertType][Math.floor(Math.random() * messages[alertType].length)]}</span>`;
        container.insertBefore(alert, container.firstChild);
        
        if (container.children.length > 6) {
            container.removeChild(container.lastChild);
        }
    }
}

// ===== MÉTRICAS POR FASE =====
function updateMejoraMetrics() {
    animateNumber('indiceMejora', randomBetween(85, 98));
    animateNumber('satisfaccionMejora', randomBetween(88, 97), '%');
    animateNumber('desempenoMejora', randomBetween(80, 95), '%');
    animateNumber('ideasImplementadas', randomBetween(15, 35));
}

function updateSeguridadMetrics() {
    animateNumber('cumplimientoPoliticas', randomBetween(85, 99), '%');
    animateNumber('controlesAcceso', randomBetween(45, 65));
    animateNumber('auditorias', randomBetween(8, 15));
    animateNumber('incidentesSeguridad', randomBetween(0, 5));
    animateNumber('uptime', randomBetween(98, 99.9), '%');
    document.getElementById('downtime').textContent = `${randomBetween(1, 12)}h`;
}

function updateRiesgosMetrics() {
    const highRisks = risks.filter(r => r.level === 'Alto' || r.level === 'Crítico').length;
    const mediumRisks = risks.filter(r => r.level === 'Medio').length;
    const lowRisks = risks.filter(r => r.level === 'Bajo').length;
    
    animateNumber('riesgosAltos', highRisks);
    animateNumber('riesgosMedios', mediumRisks);
    animateNumber('riesgosBajos', lowRisks);
    animateNumber('controles', randomBetween(20, 35));
}

function updatePlanificacionMetrics() {
    animateNumber('avancePlan', randomBetween(65, 90), '%');
    document.getElementById('presupuestoPlan').textContent = `${randomBetween(50000, 150000).toLocaleString()}`;
    animateNumber('desviacionPlan', randomBetween(0, 15), '%');
}

// ===== SEMÁFORO =====
function updateTrafficLight(satisfaction) {
    const lights = document.querySelectorAll('.light');
    lights.forEach(l => l.classList.remove('active'));
    
    const status = document.getElementById('trafficStatus');
    
    if (satisfaction >= 90) {
        document.querySelector('.light.green').classList.add('active');
        status.textContent = 'Rendimiento Óptimo';
        status.style.color = 'var(--secondary-color)';
    } else if (satisfaction >= 75) {
        document.querySelector('.light.yellow').classList.add('active');
        status.textContent = 'Rendimiento Aceptable';
        status.style.color = 'var(--warning-color)';
    } else {
        document.querySelector('.light.red').classList.add('active');
        status.textContent = 'Requiere Atención';
        status.style.color = 'var(--danger-color)';
    }
}

// ===== BARRA DE PROGRESO =====
function updateProgressBar(barId, textId, value) {
    const bar = document.getElementById(barId);
    const text = document.getElementById(textId);
    if (bar && text) {
        bar.style.width = `${value}%`;
        text.textContent = `${value}%`;
    }
}

// ===== ANIMACIÓN DE NÚMEROS =====
function animateNumber(elementId, targetValue, suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.classList.add('update-flash');
    setTimeout(() => element.classList.remove('update-flash'), 500);
    
    element.textContent = targetValue + suffix;
}

// ===== FILTRADO DE TICKETS =====
function filterTickets(filter) {
    const tbody = document.getElementById('tablaTickets');
    const rows = tbody.getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        if (filter === 'all') {
            row.style.display = '';
        } else {
            const statusCell = row.cells[3];
            const status = statusCell.textContent.toLowerCase();
            row.style.display = status.includes(filter) ? '' : 'none';
        }
    });
}

// ===== LOGS DEL SISTEMA =====
function addLog(message, type = 'info') {
    const container = document.getElementById('logsContainer');
    if (!container) return;
    
    const log = document.createElement('div');
    log.className = `log-entry ${type}`;
    const timestamp = new Date().toLocaleTimeString('es-ES');
    log.textContent = `[${timestamp}] ${message}`;
    
    container.insertBefore(log, container.firstChild);
    
    // Mantener solo los últimos 30 logs
    if (container.children.length > 30) {
        container.removeChild(container.lastChild);
    }
    
    // Auto-scroll
    container.scrollTop = 0;
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ===== PREDICCIÓN =====
function updatePrediction() {
    if (predictionHistory.length < 3) return;
    
    const recent = predictionHistory.slice(-5);
    const avgSatisfaction = recent.reduce((sum, h) => sum + h.satisfaction, 0) / recent.length;
    const avgPerformance = recent.reduce((sum, h) => sum + h.performance, 0) / recent.length;
    
    const trend = avgSatisfaction > 90 && avgPerformance > 85 ? 'Mejora' : avgSatisfaction > 80 ? 'Estable' : 'Descendente';
    
    const predictions = {
        'Mejora': `Tendencia positiva. Se proyecta un incremento del ${randomBetween(3, 8)}% en satisfacción.`,
        'Estable': `Rendimiento estable. Se mantendrán los niveles actuales con variación del ±${randomBetween(2, 5)}%.`,
        'Descendente': `Requiere atención. Se recomienda implementar mejoras para evitar caída del ${randomBetween(5, 10)}%.`
    };
    
    const predictionText = document.getElementById('predictionText');
    if (predictionText) {
        predictionText.textContent = predictions[trend];
    }
}

// ===== FUNCIONES AUXILIARES =====
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPriorityClass(priority) {
    const map = { 'Alta': 'danger', 'Media': 'warning', 'Baja': 'info' };
    return map[priority] || 'info';
}

function getStatusClass(status) {
    const map = { 'Abierto': 'danger', 'En Proceso': 'warning', 'Cerrado': 'success' };
    return map[status] || 'info';
}

function getImpactClass(impact) {
    const map = { 'Crítico': 'danger', 'Alto': 'danger', 'Medio': 'warning', 'Bajo': 'info' };
    return map[impact] || 'info';
}

function getRiskLevelClass(level) {
    const map = { 'Crítico': 'danger', 'Alto': 'danger', 'Medio': 'warning', 'Bajo': 'success' };
    return map[level] || 'info';
}

function getChangeStatusClass(status) {
    const map = { 'Aprobado': 'success', 'Prueba en curso': 'warning', 'Completado': 'success', 'Pendiente': 'info' };
    return map[status] || 'info';
}

function getTaskStatusClass(status) {
    const map = { 'Completado': 'success', 'En Proceso': 'warning', 'Pendiente': 'info' };
    return map[status] || 'info';
}

function calculateRiskLevel(impact, probability) {
    const impactScore = { 'Bajo': 1, 'Medio': 2, 'Alto': 3, 'Crítico': 4 };
    const probScore = { 'Baja': 1, 'Media': 2, 'Alta': 3 };
    
    const score = (impactScore[impact] || 1) * (probScore[probability] || 1);
    
    if (score >= 9) return 'Crítico';
    if (score >= 6) return 'Alto';
    if (score >= 3) return 'Medio';
    return 'Bajo';
}

function getMonthName(offset) {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const now = new Date();
    const monthIndex = (now.getMonth() - offset + 12) % 12;
    return months[monthIndex];
}

function playSound(type) {
    // Función para efectos de sonido (opcional, requiere archivos de audio)
    // Por ahora solo un placeholder
}

// ===== FUNCIONES ESPECÍFICAS =====
function generarPlan() {
    showNotification('Plan estratégico generado correctamente', 'success');
    addLog('Nuevo plan estratégico generado', 'success');
    
    // Actualizar métricas de planificación
    updatePlanificacionMetrics();
    
    // Actualizar timeline
    updateTimeline();
}

function aplicarMejora() {
    showNotification('Mejora aplicada exitosamente', 'success');
    addLog('Mejora continua aplicada al sistema', 'success');
    
    // Generar nueva mejora
    generateImprovement();
    
    // Actualizar displays
    updateImprovementsList();
    updateMejoraMetrics();
    
    // Incrementar contador
    const current = parseInt(document.getElementById('ideasImplementadas').textContent);
    animateNumber('ideasImplementadas', current + 1);
}

// ===== INICIALIZACIÓN DE GRÁFICOS =====
function initializeCharts() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#ecf0f1' : '#2c3e50';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    
    // Configuración común para mejorar visualización
    Chart.defaults.font.size = 13;
    Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    
    // Gráfico de Fases
    const ctxFases = document.getElementById('chartFases');
    if (ctxFases) {
        charts.fases = new Chart(ctxFases, {
            type: 'bar',
            data: {
                labels: ['Planificación', 'Diseño', 'Transición', 'Operación', 'Mejora'],
                datasets: [{
                    label: 'Rendimiento (%)',
                    data: [85, 92, 78, 88, 90],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(155, 89, 182, 0.7)',
                        'rgba(241, 196, 15, 0.7)',
                        'rgba(231, 76, 60, 0.7)'
                    ],
                    borderColor: [
                        'rgb(52, 152, 219)',
                        'rgb(46, 204, 113)',
                        'rgb(155, 89, 182)',
                        'rgb(241, 196, 15)',
                        'rgb(231, 76, 60)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: { 
                            color: textColor,
                            padding: 15,
                            font: { size: 13 }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { 
                            color: textColor,
                            font: { size: 12 }
                        },
                        grid: { color: gridColor }
                    },
                    x: {
                        ticks: { 
                            color: textColor,
                            font: { size: 12 }
                        },
                        grid: { color: gridColor }
                    }
                }
            }
        });
    }
    
    // Gráfico de Servicios
    const ctxServicios = document.getElementById('chartServicios');
    if (ctxServicios) {
        charts.servicios = new Chart(ctxServicios, {
            type: 'doughnut',
            data: {
                labels: ['Correo', 'Almacenamiento', 'VPN', 'Helpdesk', 'Otros'],
                datasets: [{
                    data: [25, 20, 15, 30, 10],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(155, 89, 182, 0.8)',
                        'rgba(241, 196, 15, 0.8)',
                        'rgba(231, 76, 60, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.3,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            color: textColor,
                            padding: 12,
                            font: { size: 13 }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de Tendencia
    const ctxTendencia = document.getElementById('chartTendencia');
    if (ctxTendencia) {
        charts.tendencia = new Chart(ctxTendencia, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Satisfacción',
                    data: [82, 85, 88, 87, 91, 93],
                    borderColor: 'rgb(52, 152, 219)',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3
                }, {
                    label: 'Disponibilidad',
                    data: [95, 97, 96, 98, 98, 99],
                    borderColor: 'rgb(46, 204, 113)',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                plugins: {
                    legend: {
                        labels: { 
                            color: textColor,
                            padding: 15,
                            font: { size: 13 }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { 
                            color: textColor,
                            font: { size: 12 }
                        },
                        grid: { color: gridColor }
                    },
                    x: {
                        ticks: { 
                            color: textColor,
                            font: { size: 12 }
                        },
                        grid: { color: gridColor }
                    }
                }
            }
        });
    }
    
    // Gauge SLA
    const ctxSLA = document.getElementById('gaugeSLA');
    if (ctxSLA) {
        const slaValue = 95;
        charts.sla = new Chart(ctxSLA, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [slaValue, 100 - slaValue],
                    backgroundColor: ['rgba(46, 204, 113, 0.8)', 'rgba(200, 200, 200, 0.2)'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.8,
                rotation: -90,
                circumference: 180,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            },
            plugins: [{
                id: 'gaugeText',
                afterDraw: (chart) => {
                    const ctx = chart.ctx;
                    const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
                    const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 1.5;
                    
                    ctx.save();
                    ctx.font = 'bold 32px Arial';
                    ctx.fillStyle = textColor;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(slaValue + '%', centerX, centerY);
                    ctx.restore();
                }
            }]
        });
    }
    
    // Gráfico de Planificación
    const ctxPlan = document.getElementById('chartPlanificacion');
    if (ctxPlan) {
        charts.planificacion = new Chart(ctxPlan, {
            type: 'doughnut',
            data: {
                labels: ['Completado', 'En Proceso', 'Pendiente'],
                datasets: [{
                    data: [45, 35, 20],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(241, 196, 15, 0.8)',
                        'rgba(189, 195, 199, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.4,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            color: textColor,
                            padding: 12,
                            font: { size: 13 }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de Madurez
    const ctxMadurez = document.getElementById('chartMadurez');
    if (ctxMadurez) {
        charts.madurez = new Chart(ctxMadurez, {
            type: 'radar',
            data: {
                labels: ['Disponibilidad', 'Seguridad', 'Escalabilidad', 'Mantenibilidad', 'Usabilidad'],
                datasets: [{
                    label: 'Nivel Actual',
                    data: [90, 85, 75, 88, 92],
                    borderColor: 'rgb(52, 152, 219)',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    pointBackgroundColor: 'rgb(52, 152, 219)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(52, 152, 219)',
                    borderWidth: 3,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.4,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { 
                            color: textColor,
                            backdropColor: 'transparent',
                            font: { size: 12 }
                        },
                        grid: { color: gridColor },
                        pointLabels: { 
                            color: textColor,
                            font: { size: 12 }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: { 
                            color: textColor,
                            font: { size: 13 }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de Pruebas
    const ctxPruebas = document.getElementById('chartPruebas');
    if (ctxPruebas) {
        charts.pruebas = new Chart(ctxPruebas, {
            type: 'pie',
            data: {
                labels: ['Exitosas', 'Fallidas', 'Pendientes'],
                datasets: [{
                    data: [75, 15, 10],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(231, 76, 60, 0.8)',
                        'rgba(189, 195, 199, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.4,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            color: textColor,
                            padding: 12,
                            font: { size: 13 }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de Tickets
    const ctxTickets = document.getElementById('chartTickets');
    if (ctxTickets) {
        charts.tickets = new Chart(ctxTickets, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Abiertos',
                    data: [12, 15, 18, 22, 19, 16],
                    borderColor: 'rgb(231, 76, 60)',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4,
                    borderWidth: 3,
                    fill: true
                }, {
                    label: 'Cerrados',
                    data: [8, 10, 14, 18, 20, 22],
                    borderColor: 'rgb(46, 204, 113)',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.4,
                    borderWidth: 3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        labels: { 
                            color: textColor,
                            padding: 15,
                            font: { size: 13 }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { 
                            color: textColor,
                            font: { size: 12 }
                        },
                        grid: { color: gridColor }
                    },
                    x: {
                        ticks: { 
                            color: textColor,
                            font: { size: 12 }
                        },
                        grid: { color: gridColor }
                    }
                }
            }
        });
    }
    
    // Gráfico de Mejora
    const ctxMejora = document.getElementById('chartMejora');
    if (ctxMejora) {
        charts.mejora = new Chart(ctxMejora, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Índice de Mejora',
                    data: [70, 75, 78, 82, 87, 90],
                    borderColor: 'rgb(155, 89, 182)',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        labels: { 
                            color: textColor,
                            padding: 15,
                            font: { size: 13 }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { 
                            color: textColor,
                            font: { size: 12 }
                        },
                        grid: { color: gridColor }
                    },
                    x: {
                        ticks: { 
                            color: textColor,
                            font: { size: 12 }
                        },
                        grid: { color: gridColor }
                    }
                }
            }
        });
    }
    
    // Gráfico Histórico
    const ctxHistorico = document.getElementById('chartHistorico');
    if (ctxHistorico) {
        charts.historico = new Chart(ctxHistorico, {
            type: 'bar',
            data: {
                labels: historicalData.map(d => d.month),
                datasets: [{
                    label: 'Satisfacción',
                    data: historicalData.map(d => d.satisfaccion),
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgb(52, 152, 219)',
                    borderWidth: 2
                }, {
                    label: 'Rendimiento',
                    data: historicalData.map(d => d.rendimiento),
                    backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    borderColor: 'rgb(46, 204, 113)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        labels: { 
                            color: textColor,
                            padding: 15,
                            font: { size: 13 }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { 
                            color: textColor,
                            font: { size: 12 }
                        },
                        grid: { color: gridColor }
                    },
                    x: {
                        ticks: { 
                            color: textColor,
                            font: { size: 12 }
                        },
                        grid: { color: gridColor }
                    }
                }
            }
        });
    }
    
    // Gráfico de Controles de Seguridad
    const ctxControles = document.getElementById('chartControles');
    if (ctxControles) {
        charts.controles = new Chart(ctxControles, {
            type: 'doughnut',
            data: {
                labels: ['Implementados', 'Parciales', 'Pendientes'],
                datasets: [{
                    data: [70, 20, 10],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(241, 196, 15, 0.8)',
                        'rgba(231, 76, 60, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.4,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            color: textColor,
                            padding: 12,
                            font: { size: 13 }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de Disponibilidad
    const ctxDisp = document.getElementById('chartDisponibilidad');
    if (ctxDisp) {
        const uptimeValue = 99.2;
        charts.disponibilidad = new Chart(ctxDisp, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [uptimeValue, 100 - uptimeValue],
                    backgroundColor: ['rgba(46, 204, 113, 0.8)', 'rgba(231, 76, 60, 0.2)'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.8,
                rotation: -90,
                circumference: 180,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            },
            plugins: [{
                id: 'gaugeText',
                afterDraw: (chart) => {
                    const ctx = chart.ctx;
                    const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
                    const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 1.5;
                    
                    ctx.save();
                    ctx.font = 'bold 32px Arial';
                    ctx.fillStyle = textColor;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(uptimeValue + '%', centerX, centerY);
                    ctx.restore();
                }
            }]
        });
    }
    
    // Gráfico de Predicción
    const ctxPred = document.getElementById('chartPrediccion');
    if (ctxPred) {
        charts.prediccion = new Chart(ctxPred, {
            type: 'line',
            data: {
                labels: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7'],
                datasets: [{
                    label: 'Proyección',
                    data: [85, 87, 88, 90, 91, 92, 94],
                    borderColor: 'rgb(155, 89, 182)',
                    backgroundColor: 'rgba(155, 89, 182, 0.1)',
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.8,
                plugins: {
                    legend: {
                        labels: { 
                            color: textColor,
                            padding: 15,
                            font: { size: 13 }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { 
                            color: textColor,
                            font: { size: 12 }
                        },
                        grid: { color: gridColor }
                    },
                    x: {
                        ticks: { 
                            color: textColor,
                            font: { size: 12 }
                        },
                        grid: { color: gridColor }
                    }
                }
            }
        });
    }
    
    // Mapa de calor de riesgos
    const ctxHeatmap = document.getElementById('riskHeatmap');
    if (ctxHeatmap) {
        const ctx = ctxHeatmap.getContext('2d');
        ctxHeatmap.width = 500;
        ctxHeatmap.height = 500;
        drawRiskHeatmap(ctx);
    }
    
    // Configurar listeners de clicks en gráficos
    setupChartClickListeners();
}

// ===== ACTUALIZACIÓN DE GRÁFICOS =====
function updateAllCharts() {
    // Actualizar gráfico de fases
    if (charts.fases) {
        charts.fases.data.datasets[0].data = [
            randomBetween(80, 95),
            randomBetween(85, 98),
            randomBetween(75, 90),
            randomBetween(82, 95),
            randomBetween(85, 96)
        ];
        charts.fases.update('none');
    }
    
    // Actualizar gauge SLA
    if (charts.sla) {
        const slaValue = randomBetween(92, 99);
        charts.sla.data.datasets[0].data = [slaValue, 100 - slaValue];
        charts.sla.update('none');
    }
    
    // Actualizar disponibilidad
    if (charts.disponibilidad) {
        const uptime = randomBetween(98, 99.9);
        charts.disponibilidad.data.datasets[0].data = [uptime, 100 - uptime];
        charts.disponibilidad.update('none');
    }
}

function updateChartsTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#ecf0f1' : '#2c3e50';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    
    Object.values(charts).forEach(chart => {
        if (!chart || !chart.options) return;
        
        if (chart.options.plugins && chart.options.plugins.legend) {
            chart.options.plugins.legend.labels.color = textColor;
        }
        
        if (chart.options.scales) {
            ['x', 'y', 'r'].forEach(axis => {
                if (chart.options.scales[axis]) {
                    if (chart.options.scales[axis].ticks) {
                        chart.options.scales[axis].ticks.color = textColor;
                    }
                    if (chart.options.scales[axis].grid) {
                        chart.options.scales[axis].grid.color = gridColor;
                    }
                    if (chart.options.scales[axis].pointLabels) {
                        chart.options.scales[axis].pointLabels.color = textColor;
                    }
                }
            });
        }
        
        chart.update();
    });
}

// ===== MAPA DE CALOR DE RIESGOS DINÁMICO =====
function drawRiskHeatmap(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const cellWidth = width / 5;
    const cellHeight = height / 5;
    
    // Calcular matriz basada en riesgos reales
    const matrix = calculateRiskMatrix();
    
    const colors = [
        '#27ae60', // Verde (bajo)
        '#2ecc71', // Verde claro
        '#f1c40f', // Amarillo
        '#e67e22', // Naranja
        '#e74c3c'  // Rojo (alto)
    ];
    
    const impactLabels = ['Muy Bajo', 'Bajo', 'Medio', 'Alto', 'Crítico'];
    const probLabels = ['Muy Baja', 'Baja', 'Media', 'Alta', 'Muy Alta'];
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Dibujar celdas
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const riskCount = matrix[i][j].count;
            const riskLevel = (i + 1) * (j + 1);
            let colorIndex = Math.min(Math.floor((riskLevel - 1) / 5), 4);
            
            // Color base
            ctx.fillStyle = colors[colorIndex];
            ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
            
            // Borde
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
            
            // Texto con conteo de riesgos
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(riskCount, j * cellWidth + cellWidth / 2, i * cellHeight + cellHeight / 2 - 10);
            
            // Texto pequeño con nivel
            ctx.font = '12px Arial';
            ctx.fillText(`Nivel ${riskLevel}`, j * cellWidth + cellWidth / 2, i * cellHeight + cellHeight / 2 + 15);
            
            // Hacer celdas clicables
            addHeatmapClickListener(ctx.canvas, j, i, cellWidth, cellHeight, matrix[i][j]);
        }
    }
    
    // Labels
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary') || '#2c3e50';
    ctx.fillStyle = textColor;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Probabilidad →', width / 2, height - 5);
    
    // Labels de probabilidad en la parte superior
    ctx.font = '11px Arial';
    for (let j = 0; j < 5; j++) {
        ctx.fillText(probLabels[j], j * cellWidth + cellWidth / 2, 15);
    }
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Impacto →', 0, 0);
    ctx.restore();
    
    // Labels de impacto en el lado izquierdo
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.translate(35, i * cellHeight + cellHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(impactLabels[i], 0, 0);
        ctx.restore();
    }
}

// ===== CALCULAR MATRIZ DE RIESGOS =====
function calculateRiskMatrix() {
    const matrix = Array(5).fill(null).map(() => Array(5).fill(null).map(() => ({
        count: 0,
        risks: []
    })));
    
    const impactMap = { 'Bajo': 0, 'Medio': 2, 'Alto': 3, 'Crítico': 4 };
    const probMap = { 'Baja': 0, 'Media': 2, 'Alta': 4 };
    
    risks.forEach(risk => {
        const impactIndex = impactMap[risk.impact] || 1;
        const probIndex = probMap[risk.probability] || 1;
        
        if (matrix[impactIndex] && matrix[impactIndex][probIndex]) {
            matrix[impactIndex][probIndex].count++;
            matrix[impactIndex][probIndex].risks.push(risk);
        }
    });
    
    return matrix;
}

// ===== CLICK EN CELDAS DEL MAPA DE CALOR =====
function addHeatmapClickListener(canvas, col, row, cellWidth, cellHeight, cellData) {
    if (!canvas.clickListenersAdded) {
        canvas.clickListenersAdded = true;
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const clickedCol = Math.floor(x / cellWidth);
            const clickedRow = Math.floor(y / cellHeight);
            
            const matrix = calculateRiskMatrix();
            if (matrix[clickedRow] && matrix[clickedRow][clickedCol]) {
                const data = matrix[clickedRow][clickedCol];
                showHeatmapDetail(clickedRow, clickedCol, data);
            }
        });
        
        // Hover effect
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const col = Math.floor(x / cellWidth);
            const row = Math.floor(y / cellHeight);
            
            if (col >= 0 && col < 5 && row >= 0 && row < 5) {
                canvas.style.cursor = 'pointer';
                canvas.title = `Click para ver detalles de riesgos en esta celda`;
            } else {
                canvas.style.cursor = 'default';
            }
        });
    }
}

// ===== MOSTRAR DETALLE DE CELDA DEL MAPA DE CALOR =====
function showHeatmapDetail(row, col, data) {
    const impactLabels = ['Muy Bajo', 'Bajo', 'Medio', 'Alto', 'Crítico'];
    const probLabels = ['Muy Baja', 'Baja', 'Media', 'Alta', 'Muy Alta'];
    
    const riskLevel = (row + 1) * (col + 1);
    let levelText = 'Bajo';
    if (riskLevel >= 16) levelText = 'Crítico';
    else if (riskLevel >= 10) levelText = 'Alto';
    else if (riskLevel >= 6) levelText = 'Medio';
    
    let risksHtml = '<p><em>No hay riesgos en esta categoría</em></p>';
    if (data.risks.length > 0) {
        risksHtml = '<ul class="risk-list">';
        data.risks.forEach(risk => {
            risksHtml += `
                <li>
                    <strong>${risk.id}</strong> - ${risk.description}
                    <br><small>Categoría: ${risk.category}</small>
                </li>
            `;
        });
        risksHtml += '</ul>';
    }
    
    showDetailModal(`Matriz de Riesgos - Celda [${row}, ${col}]`, `
        <div class="heatmap-detail">
            <p><strong>Impacto:</strong> ${impactLabels[row]}</p>
            <p><strong>Probabilidad:</strong> ${probLabels[col]}</p>
            <p><strong>Nivel de Riesgo:</strong> <span class="badge badge-${getRiskLevelClass(levelText)}">${levelText}</span> (${riskLevel}/25)</p>
            <p><strong>Cantidad de Riesgos:</strong> ${data.count}</p>
            <hr>
            <h4>Riesgos en esta categoría:</h4>
            ${risksHtml}
            <hr>
            <p><strong>Recomendación:</strong> ${getRecommendation(levelText)}</p>
        </div>
    `);
    
    addLog(`Consultando matriz de riesgos: Impacto ${impactLabels[row]}, Probabilidad ${probLabels[col]}`, 'info');
}

function getRecommendation(level) {
    const recommendations = {
        'Crítico': 'Acción inmediata requerida. Implementar controles urgentes y escalar a dirección.',
        'Alto': 'Prioridad alta. Desarrollar plan de mitigación en las próximas 48 horas.',
        'Medio': 'Monitorear regularmente. Implementar controles preventivos.',
        'Bajo': 'Mantener vigilancia. Revisar en auditorías programadas.'
    };
    return recommendations[level] || 'Evaluar según contexto organizacional.';
}

// ===== ACTUALIZAR MATRIZ DE CALOR =====
function updateRiskHeatmap() {
    const canvas = document.getElementById('riskHeatmap');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        drawRiskHeatmap(ctx);
    }
}

function updateRisksTable() {
    const tbody = document.getElementById('tablaRiesgos');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    risks.slice(-15).reverse().forEach(risk => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${risk.id}</strong></td>
            <td>${risk.description}</td>
            <td>${risk.category}</td>
            <td><span class="badge badge-${getImpactClass(risk.impact)}">${risk.impact}</span></td>
            <td>${risk.probability}</td>
            <td><span class="badge badge-${getRiskLevelClass(risk.level)}">${risk.level}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function updateVersionsTable() {
    const tbody = document.getElementById('tablaVersiones');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    changes.slice(-10).reverse().forEach(change => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${change.version}</strong></td>
            <td>${change.date}</td>
            <td>${change.responsible}</td>
            <td><span class="badge badge-${getChangeStatusClass(change.status)}">${change.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function updateUsersTable() {
    const tbody = document.getElementById('tablaUsuarios');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${user.name}</strong></td>
            <td>${user.role}</td>
            <td>${user.area}</td>
            <td><span class="badge badge-success">${user.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function updatePlanningTable() {
    const tbody = document.getElementById('tablaPlanificacion');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const tasks = [
        { responsible: 'Juan Pérez', task: 'Análisis de requisitos', status: 'En Proceso', progress: randomBetween(60, 90) },
        { responsible: 'María García', task: 'Diseño de arquitectura', status: 'Completado', progress: 100 },
        { responsible: 'Carlos López', task: 'Desarrollo de módulos', status: 'En Proceso', progress: randomBetween(40, 70) },
        { responsible: 'Ana Martínez', task: 'Pruebas de calidad', status: 'Pendiente', progress: randomBetween(0, 30) }
    ];
    
    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${task.responsible}</strong></td>
            <td>${task.task}</td>
            <td><span class="badge badge-${getTaskStatusClass(task.status)}">${task.status}</span></td>
            <td>
                <div class="progress-wrapper" style="height: 20px;">
                    <div class="progress-fill" style="width: ${task.progress}%"></div>
                    <span class="progress-text" style="font-size: 0.8rem;">${task.progress}%</span>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}