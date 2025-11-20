// ===== VARIABLES GLOBALES =====
let simulationActive = true;
let updateCount = 0;
let startTime = Date.now();
let charts = {};
let tickets = [];
let risks = [];
let planningTasks = [];

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    initializeSystem();
    setupEventListeners();
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
            showNotification(`Sección ${section} activada`, 'info');
        });
    });

    // Toggle tema
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Filtros de tickets
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            filterTickets(filter);
        });
    });

    // Formulario de planificación
    const formPlan = document.getElementById('formPlanificacion');
    if (formPlan) {
        formPlan.addEventListener('submit', (e) => {
            e.preventDefault();
            generarPlan();
        });
    }

    // Formulario de tickets
    const formTicket = document.getElementById('formTicket');
    if (formTicket) {
        formTicket.addEventListener('submit', (e) => {
            e.preventDefault();
            agregarTicketManual();
        });
    }

    // Búsqueda y filtros
    const searchResponsable = document.getElementById('searchResponsable');
    if (searchResponsable) {
        searchResponsable.addEventListener('input', filterPlanningTasks);
    }

    const filterStatus = document.getElementById('filterStatus');
    if (filterStatus) {
        filterStatus.addEventListener('change', filterPlanningTasks);
    }
}

// ===== SISTEMA DE NAVEGACIÓN =====
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
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
    createParticles();
    showNotification('Sistema SIGS-TI iniciado correctamente', 'success');
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
    for (let i = 0; i < 15; i++) generateTicket();
    for (let i = 0; i < 12; i++) generateRisk();
    generatePlanningTasks();
    
    updateAllDisplays();
    updateAllCharts();
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
    
    if (tickets.length > 50) {
        tickets.shift();
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

function generatePlanningTasks() {
    const responsibles = [
        'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 
        'Luis Rodríguez', 'Pedro Sánchez', 'Laura Fernández', 'Diego Torres'
    ];
    
    const tasks = [
        'Análisis de requisitos', 'Diseño de arquitectura', 'Desarrollo de módulos',
        'Pruebas de calidad', 'Documentación técnica', 'Capacitación de usuarios',
        'Migración de datos', 'Configuración de servidores', 'Implementación de seguridad'
    ];
    
    const statuses = ['Completado', 'En Proceso', 'Pendiente'];
    
    planningTasks = [];
    for (let i = 0; i < 12; i++) {
        const startDate = new Date(Date.now() - randomBetween(1, 60) * 86400000);
        const endDate = new Date(startDate.getTime() + randomBetween(10, 45) * 86400000);
        
        planningTasks.push({
            responsible: responsibles[randomBetween(0, responsibles.length - 1)],
            task: tasks[i % tasks.length],
            status: statuses[randomBetween(0, statuses.length - 1)],
            progress: randomBetween(0, 100),
            startDate: startDate.toLocaleDateString('es-ES'),
            endDate: endDate.toLocaleDateString('es-ES')
        });
    }
}

// ===== AGREGAR TICKET MANUAL =====
function agregarTicketManual() {
    const titulo = document.getElementById('inputTituloTicket').value;
    const prioridad = document.getElementById('inputPrioridadTicket').value;
    const asignado = document.getElementById('inputAsignadoTicket').value;
    
    if (!titulo || !prioridad || !asignado) {
        showNotification('Por favor complete todos los campos', 'warning');
        return;
    }
    
    const ticket = {
        id: `TK-${1000 + tickets.length}`,
        title: titulo,
        priority: prioridad,
        status: 'Abierto',
        assignee: asignado,
        date: new Date().toLocaleString('es-ES'),
        resolvedTime: 0
    };
    
    tickets.push(ticket);
    
    // Limpiar formulario
    document.getElementById('formTicket').reset();
    
    // Actualizar todo
    updateAllDisplays();
    updateAllCharts();
    
    showNotification(`Ticket ${ticket.id} creado exitosamente`, 'success');
}

// ===== GENERAR PLAN =====
function generarPlan() {
    const objetivo = document.getElementById('inputObjetivo').value;
    const alcance = document.getElementById('inputAlcance').value;
    const presupuesto = document.getElementById('inputPresupuesto').value;
    
    if (!objetivo || !alcance || !presupuesto) {
        showNotification('Por favor complete todos los campos', 'warning');
        return;
    }
    
    // Crear nueva tarea
    const nuevaTarea = {
        responsible: 'Juan Pérez',
        task: objetivo,
        status: 'Pendiente',
        progress: 0,
        startDate: new Date().toLocaleDateString('es-ES'),
        endDate: new Date(Date.now() + 30 * 86400000).toLocaleDateString('es-ES')
    };
    
    planningTasks.push(nuevaTarea);
    
    // Actualizar métricas
    document.getElementById('presupuestoPlan').textContent = `$${parseInt(presupuesto).toLocaleString()}`;
    
    // Limpiar formulario
    document.getElementById('formPlanificacion').reset();
    
    // Actualizar todo
    updateAllDisplays();
    updateAllCharts();
    
    showNotification('Plan estratégico generado correctamente', 'success');
}

// ===== SIMULACIÓN AUTOMÁTICA =====
function startSimulation() {
    setInterval(() => {
        if (!simulationActive) return;
        
        updateCount++;
        updateGlobalMetrics();
        
        if (Math.random() > 0.7) {
            generateTicket();
            updateAllDisplays();
            updateAllCharts();
        }
        
        if (Math.random() > 0.85) {
            generateRisk();
            updateAllCharts();
        }
        
        if (Math.random() > 0.9) {
            showNotification('Nuevo evento del sistema detectado', 'info');
        }
        
    }, 5000);
}

// ===== MÉTRICAS GLOBALES =====
function updateGlobalMetrics() {
    const totalTickets = tickets.length;
    const closedTickets = tickets.filter(t => t.status === 'Cerrado').length;
    const openTickets = tickets.filter(t => t.status === 'Abierto').length;
    const processingTickets = tickets.filter(t => t.status === 'En Proceso').length;
    const avgTime = tickets.reduce((sum, t) => sum + t.resolvedTime, 0) / tickets.length || 0;
    const satisfaction = randomBetween(85, 98);
    
    animateNumber('totalTickets', totalTickets);
    animateNumber('ticketsCerrados', closedTickets);
    document.getElementById('tiempoPromedio').textContent = `${avgTime.toFixed(1)}h`;
    animateNumber('satisfaccionGlobal', satisfaction, '%');
    
    animateNumber('ticketsAbiertos', openTickets);
    animateNumber('ticketsProceso', processingTickets);
    animateNumber('ticketsResueltos', closedTickets);
    document.getElementById('tiempoResolucion').textContent = `${avgTime.toFixed(1)}h`;
    
    updateTrafficLight(satisfaction);
    
    const globalProgress = randomBetween(75, 95);
    updateProgressBar('progressGlobal', 'progressGlobalText', globalProgress);
}

// ===== ACTUALIZACIÓN DE TODOS LOS DISPLAYS =====
function updateAllDisplays() {
    updateTicketsTable();
    updatePlanningTable();
    updatePlanificacionMetrics();
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

function updatePlanningTable() {
    const tbody = document.getElementById('tablaPlanificacion');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    planningTasks.forEach(task => {
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
            <td>${task.startDate}</td>
            <td>${task.endDate}</td>
        `;
        tbody.appendChild(row);
    });
}

// ===== MÉTRICAS POR FASE =====
function updatePlanificacionMetrics() {
    animateNumber('avancePlan', randomBetween(65, 90), '%');
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

function filterPlanningTasks() {
    const searchTerm = document.getElementById('searchResponsable')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('filterStatus')?.value || 'all';
    
    const rows = document.querySelectorAll('#tablaPlanificacion tr');
    
    rows.forEach(row => {
        const responsible = row.cells[0]?.textContent.toLowerCase() || '';
        const task = row.cells[1]?.textContent.toLowerCase() || '';
        const status = row.cells[2]?.querySelector('.badge')?.textContent || '';
        
        const matchesSearch = responsible.includes(searchTerm) || task.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || status === statusFilter;
        
        if (matchesSearch && matchesStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
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

// ===== INICIALIZACIÓN DE GRÁFICOS (9 GRÁFICOS) =====
function initializeCharts() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#ecf0f1' : '#2c3e50';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    
    Chart.defaults.font.size = 11;
    Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    
    // 1. Gráfico de Fases
    charts.fases = new Chart(document.getElementById('chartFases'), {
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
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                },
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            }
        }
    });
    
    // 2. Distribución de Servicios
    charts.servicios = new Chart(document.getElementById('chartServicios'), {
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
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: textColor, padding: 8, font: { size: 10 } }
                }
            }
        }
    });
    
    // 3. Tendencia Mensual
    charts.tendencia = new Chart(document.getElementById('chartTendencia'), {
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
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                },
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            }
        }
    });
    
    // 4. Capacidad del Equipo
    charts.capacidad = new Chart(document.getElementById('chartCapacidad'), {
        type: 'radar',
        data: {
            labels: ['Desarrollo', 'Soporte', 'Infraestructura', 'Seguridad', 'QA'],
            datasets: [{
                label: 'Capacidad',
                data: [85, 92, 78, 88, 82],
                borderColor: 'rgb(52, 152, 219)',
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: textColor, backdropColor: 'transparent' },
                    grid: { color: gridColor },
                    pointLabels: { color: textColor }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
    
    // 5. Métricas de Rendimiento
    charts.metricas = new Chart(document.getElementById('chartMetricas'), {
        type: 'bar',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Tiempo (min)',
                data: [15, 12, 10, 11, 9, 8],
                backgroundColor: 'rgba(231, 76, 60, 0.7)',
                borderColor: 'rgb(231, 76, 60)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                },
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            }
        }
    });
    
    // 6. Estado de Proyectos
    charts.proyectos = new Chart(document.getElementById('chartProyectos'), {
        type: 'pie',
        data: {
            labels: ['Completados', 'En Progreso', 'Planificados', 'En Espera'],
            datasets: [{
                data: [35, 40, 15, 10],
                backgroundColor: [
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(241, 196, 15, 0.8)',
                    'rgba(189, 195, 199, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: textColor, padding: 8, font: { size: 10 } }
                }
            }
        }
    });
    
    // 7. Nivel de Riesgos
    charts.riesgos = new Chart(document.getElementById('chartRiesgos'), {
        type: 'bar',
        data: {
            labels: ['Crítico', 'Alto', 'Medio', 'Bajo'],
            datasets: [{
                label: 'Cantidad',
                data: [2, 5, 8, 12],
                backgroundColor: [
                    'rgba(231, 76, 60, 0.7)',
                    'rgba(243, 156, 18, 0.7)',
                    'rgba(241, 196, 15, 0.7)',
                    'rgba(46, 204, 113, 0.7)'
                ],
                borderColor: [
                    'rgb(231, 76, 60)',
                    'rgb(243, 156, 18)',
                    'rgb(241, 196, 15)',
                    'rgb(46, 204, 113)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor, stepSize: 1 },
                    grid: { color: gridColor }
                },
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            }
        }
    });
    
    // 8. Seguridad y Cumplimiento
    charts.seguridad = new Chart(document.getElementById('chartSeguridad'), {
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
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: textColor, padding: 8, font: { size: 10 } }
                }
            }
        }
    });
    
    // 9. Gauge SLA
    const slaValue = 95;
    charts.sla = new Chart(document.getElementById('gaugeSLA'), {
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
                ctx.font = 'bold 28px Arial';
                ctx.fillStyle = textColor;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(slaValue + '%', centerX, centerY);
                ctx.restore();
            }
        }]
    });
    
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
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: textColor, padding: 10 }
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
                plugins: {
                    legend: {
                        labels: { color: textColor, padding: 15 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    },
                    x: {
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    }
                }
            }
        });
    }
}

// ===== ACTUALIZACIÓN DE GRÁFICOS =====
function updateAllCharts() {
    // Actualizar Rendimiento por Fase
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
    
    // Actualizar Tendencia Mensual con datos reales de tickets
    if (charts.tendencia) {
        const satisfaction = tickets.length > 0 
            ? Math.min(98, 80 + (tickets.filter(t => t.status === 'Cerrado').length / tickets.length) * 18)
            : randomBetween(80, 95);
        
        // Mantener historial de 6 meses
        const lastValue = charts.tendencia.data.datasets[0].data[5] || satisfaction;
        charts.tendencia.data.datasets[0].data.shift();
        charts.tendencia.data.datasets[0].data.push(Math.floor(satisfaction));
        charts.tendencia.update('none');
    }
    
    // Actualizar Capacidad del Equipo
    if (charts.capacidad) {
        charts.capacidad.data.datasets[0].data = [
            randomBetween(80, 95),
            randomBetween(85, 98),
            randomBetween(75, 92),
            randomBetween(82, 94),
            randomBetween(78, 90)
        ];
        charts.capacidad.update('none');
    }
    
    // Actualizar Nivel de Riesgos con datos reales
    if (charts.riesgos) {
        const risksByLevel = {
            'Crítico': risks.filter(r => r.level === 'Crítico').length,
            'Alto': risks.filter(r => r.level === 'Alto').length,
            'Medio': risks.filter(r => r.level === 'Medio').length,
            'Bajo': risks.filter(r => r.level === 'Bajo').length
        };
        
        charts.riesgos.data.datasets[0].data = [
            risksByLevel['Crítico'],
            risksByLevel['Alto'],
            risksByLevel['Medio'],
            risksByLevel['Bajo']
        ];
        charts.riesgos.update('none');
    }
    
    // Actualizar Estado de Proyectos
    if (charts.proyectos) {
        const completados = planningTasks.filter(t => t.status === 'Completado').length;
        const enProceso = planningTasks.filter(t => t.status === 'En Proceso').length;
        const pendientes = planningTasks.filter(t => t.status === 'Pendiente').length;
        const total = planningTasks.length || 1;
        
        charts.proyectos.data.datasets[0].data = [
            Math.round((completados / total) * 100),
            Math.round((enProceso / total) * 100),
            Math.round((pendientes / total) * 100),
            randomBetween(5, 15)
        ];
        charts.proyectos.update('none');
    }
    
    // Actualizar Planificación
    if (charts.planificacion) {
        const completados = planningTasks.filter(t => t.status === 'Completado').length;
        const enProceso = planningTasks.filter(t => t.status === 'En Proceso').length;
        const pendientes = planningTasks.filter(t => t.status === 'Pendiente').length;
        
        charts.planificacion.data.datasets[0].data = [
            completados,
            enProceso,
            pendientes
        ];
        charts.planificacion.update('none');
    }
    
    // Actualizar Gráfico de Tickets con datos reales
    if (charts.tickets) {
        const abiertos = tickets.filter(t => t.status === 'Abierto').length;
        const cerrados = tickets.filter(t => t.status === 'Cerrado').length;
        
        // Actualizar último valor
        charts.tickets.data.datasets[0].data.shift();
        charts.tickets.data.datasets[0].data.push(abiertos);
        
        charts.tickets.data.datasets[1].data.shift();
        charts.tickets.data.datasets[1].data.push(cerrados);
        
        charts.tickets.update('none');
    }
    
    // Actualizar SLA
    if (charts.sla) {
        const slaValue = randomBetween(92, 99);
        charts.sla.data.datasets[0].data = [slaValue, 100 - slaValue];
        charts.sla.update('none');
    }
    
    // Actualizar Métricas de Rendimiento
    if (charts.metricas) {
        const avgTime = tickets.length > 0 
            ? Math.round(tickets.reduce((sum, t) => sum + t.resolvedTime, 0) / tickets.length)
            : randomBetween(8, 15);
            
        charts.metricas.data.datasets[0].data.shift();
        charts.metricas.data.datasets[0].data.push(avgTime);
        charts.metricas.update('none');
    }
    
    // Actualizar Seguridad
    if (charts.seguridad) {
        charts.seguridad.data.datasets[0].data = [
            randomBetween(65, 75),
            randomBetween(15, 25),
            randomBetween(5, 15)
        ];
        charts.seguridad.update('none');
    }
    
    // Actualizar Distribución de Servicios (menos frecuente)
    if (charts.servicios && Math.random() > 0.8) {
        charts.servicios.data.datasets[0].data = [
            randomBetween(20, 30),
            randomBetween(15, 25),
            randomBetween(10, 20),
            randomBetween(25, 35),
            randomBetween(5, 15)
        ];
        charts.servicios.update('none');
    }
}

// ===== ACTUALIZAR TEMA DE GRÁFICOS =====
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
