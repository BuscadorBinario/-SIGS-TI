// ===== VARIABLES GLOBALES =====
let simulationActive = true;
let updateCount = 0;
let startTime = Date.now();
let charts = {};
let tickets = [];
let risks = [];
let planningTasks = [];
let designServices = [];
let transitions = [];
let securityAudits = [];
let controlAlerts = [];

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
    document.querySelectorAll('.nav-menu li').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            showSection(section);
            document.querySelectorAll('.nav-menu li').forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            showNotification(`Sección ${section} activada`, 'info');
        });
    });

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            filterTickets(filter);
        });
    });

    document.querySelectorAll('.filter-btn-risk').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn-risk').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            filterRisks(filter);
        });
    });

    const formPlan = document.getElementById('formPlanificacion');
    if (formPlan) {
        formPlan.addEventListener('submit', (e) => {
            e.preventDefault();
            generarPlan();
        });
    }

    const formTicket = document.getElementById('formTicket');
    if (formTicket) {
        formTicket.addEventListener('submit', (e) => {
            e.preventDefault();
            agregarTicketManual();
        });
    }

    const formRiesgo = document.getElementById('formRiesgo');
    if (formRiesgo) {
        formRiesgo.addEventListener('submit', (e) => {
            e.preventDefault();
            agregarRiesgoManual();
        });
    }

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
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#667eea';
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
    for (let i = 0; i < 20; i++) generateTicket();
    for (let i = 0; i < 15; i++) generateRisk();
    generatePlanningTasks();
    generateDesignServices();
    generateTransitions();
    generateSecurityAudits();
    generateControlAlerts();
    
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
        'Optimización de rendimiento',
        'Configuración de VPN',
        'Instalación de software',
        'Problema con impresora',
        'Recuperación de datos'
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
        'Vulnerabilidad de seguridad detectada en servidor web',
        'Riesgo de pérdida de datos por falta de respaldos',
        'Fallo potencial en infraestructura de red',
        'Incumplimiento de política de acceso',
        'Sobrecarga del sistema de base de datos',
        'Dependencia de proveedor único',
        'Falta de respaldos actualizados',
        'Exposición de información sensible',
        'Obsolescencia de hardware crítico',
        'Falta de documentación técnica',
        'Personal insuficiente para operación 24/7',
        'Vulnerabilidad en aplicación legacy'
    ];
    
    const categories = ['Seguridad', 'Operacional', 'Estratégico', 'Cumplimiento', 'Financiero'];
    const impacts = ['Bajo', 'Medio', 'Alto', 'Crítico'];
    const probabilities = ['Baja', 'Media', 'Alta'];
    const estados = ['Activo', 'En Mitigación', 'Mitigado', 'Aceptado'];
    
    const impact = impacts[Math.floor(Math.random() * impacts.length)];
    const probability = probabilities[Math.floor(Math.random() * probabilities.length)];
    
    const risk = {
        id: `RK-${100 + risks.length}`,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        impact: impact,
        probability: probability,
        level: calculateRiskLevel(impact, probability),
        status: estados[Math.floor(Math.random() * estados.length)]
    };
    
    risks.push(risk);
    
    if (risks.length > 40) {
        risks.shift();
    }
}

function generatePlanningTasks() {
    const responsibles = [
        'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 
        'Luis Rodríguez', 'Pedro Sánchez', 'Laura Fernández', 'Diego Torres'
    ];
    
    const tasks = [
        'Análisis de requisitos del sistema',
        'Diseño de arquitectura técnica',
        'Desarrollo de módulos principales',
        'Pruebas de calidad y validación',
        'Documentación técnica completa',
        'Capacitación de usuarios finales',
        'Migración de datos históricos',
        'Configuración de servidores producción',
        'Implementación de controles de seguridad',
        'Auditoría de cumplimiento normativo',
        'Optimización de rendimiento',
        'Integración con sistemas legacy'
    ];
    
    const statuses = ['Completado', 'En Proceso', 'Pendiente'];
    
    planningTasks = [];
    for (let i = 0; i < 15; i++) {
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

function generateDesignServices() {
    const services = [
        'Portal Web Corporativo',
        'Sistema de Gestión Documental',
        'Plataforma E-Learning',
        'CRM Empresarial',
        'Sistema de Facturación',
        'Aplicación Móvil Interna',
        'Data Warehouse',
        'Sistema de Monitoreo',
        'Servicio de API Gateway',
        'Sistema de Backup Automatizado'
    ];
    
    const categories = ['Aplicación', 'Infraestructura', 'Datos', 'Seguridad', 'Integración'];
    const statuses = ['Aprobado', 'En Revisión', 'Diseño Completado'];
    
    designServices = [];
    for (let i = 0; i < 10; i++) {
        designServices.push({
            id: `DS-${200 + i}`,
            name: services[i],
            category: categories[randomBetween(0, categories.length - 1)],
            status: statuses[randomBetween(0, statuses.length - 1)],
            availability: randomBetween(95, 100) + '%',
            lastReview: new Date(Date.now() - randomBetween(1, 30) * 86400000).toLocaleDateString('es-ES')
        });
    }
}

function generateTransitions() {
    const descriptions = [
        'Actualización de sistema operativo',
        'Migración a nueva versión de base de datos',
        'Implementación de nuevo módulo CRM',
        'Cambio de proveedor de hosting',
        'Actualización de certificados SSL',
        'Configuración de nuevo firewall',
        'Despliegue de parches de seguridad',
        'Migración de servidores a la nube',
        'Actualización de framework de desarrollo',
        'Implementación de sistema de monitoreo'
    ];
    
    const types = ['Actualización', 'Migración', 'Configuración', 'Instalación', 'Mantenimiento'];
    const impacts = ['Bajo', 'Medio', 'Alto'];
    const statuses = ['Aprobado', 'En Ejecución', 'Completado', 'Rechazado'];
    
    transitions = [];
    for (let i = 0; i < 12; i++) {
        transitions.push({
            id: `CH-${300 + i}`,
            description: descriptions[i % descriptions.length],
            type: types[randomBetween(0, types.length - 1)],
            impact: impacts[randomBetween(0, impacts.length - 1)],
            status: statuses[randomBetween(0, statuses.length - 1)],
            date: new Date(Date.now() - randomBetween(1, 15) * 86400000).toLocaleDateString('es-ES')
        });
    }
}

function generateSecurityAudits() {
    const types = ['Seguridad Física', 'Seguridad Lógica', 'Cumplimiento ISO 27001', 'Análisis de Vulnerabilidades', 'Pruebas de Penetración'];
    const areas = ['Infraestructura', 'Aplicaciones', 'Base de Datos', 'Red', 'Servidores'];
    const results = ['Satisfactorio', 'Con Observaciones', 'Requiere Mejoras'];
    
    securityAudits = [];
    for (let i = 0; i < 10; i++) {
        securityAudits.push({
            id: `AUD-${400 + i}`,
            type: types[randomBetween(0, types.length - 1)],
            area: areas[randomBetween(0, areas.length - 1)],
            result: results[randomBetween(0, results.length - 1)],
            findings: randomBetween(0, 8),
            date: new Date(Date.now() - randomBetween(1, 90) * 86400000).toLocaleDateString('es-ES')
        });
    }
}

function generateControlAlerts() {
    const types = ['Info', 'Warning', 'Error', 'Critical'];
    const origins = ['Servidor Web 1', 'Servidor Web 2', 'Base de Datos', 'Firewall', 'NAS Storage', 'Red Principal'];
    const messages = [
        'Uso de CPU al 85%',
        'Memoria RAM crítica',
        'Espacio en disco bajo',
        'Temperatura elevada detectada',
        'Conexiones simultáneas altas',
        'Tráfico de red inusual',
        'Servicio reiniciado automáticamente',
        'Backup completado exitosamente',
        'Intento de acceso no autorizado bloqueado',
        'Actualización de sistema pendiente'
    ];
    const statuses = ['Nuevo', 'En Revisión', 'Resuelto', 'Ignorado'];
    
    controlAlerts = [];
    for (let i = 0; i < 15; i++) {
        const now = new Date(Date.now() - randomBetween(0, 120) * 60000);
        controlAlerts.push({
            timestamp: now.toLocaleTimeString('es-ES'),
            type: types[randomBetween(0, types.length - 1)],
            origin: origins[randomBetween(0, origins.length - 1)],
            message: messages[randomBetween(0, messages.length - 1)],
            severity: types[randomBetween(0, types.length - 1)],
            status: statuses[randomBetween(0, statuses.length - 1)]
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
    document.getElementById('formTicket').reset();
    updateAllDisplays();
    updateAllCharts();
    showNotification(`Ticket ${ticket.id} creado exitosamente`, 'success');
}

// ===== AGREGAR RIESGO MANUAL =====
function agregarRiesgoManual() {
    const desc = document.getElementById('inputDescRiesgo').value;
    const categoria = document.getElementById('inputCategoriaRiesgo').value;
    const impacto = document.getElementById('inputImpactoRiesgo').value;
    const probabilidad = document.getElementById('inputProbabilidadRiesgo').value;
    
    if (!desc || !categoria || !impacto || !probabilidad) {
        showNotification('Por favor complete todos los campos', 'warning');
        return;
    }
    
    const risk = {
        id: `RK-${100 + risks.length}`,
        description: desc,
        category: categoria,
        impact: impacto,
        probability: probabilidad,
        level: calculateRiskLevel(impacto, probabilidad),
        status: 'Activo'
    };
    
    risks.push(risk);
    document.getElementById('formRiesgo').reset();
    updateAllDisplays();
    updateAllCharts();
    showNotification(`Riesgo ${risk.id} registrado exitosamente`, 'success');
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
    
    const nuevaTarea = {
        responsible: 'Juan Pérez',
        task: objetivo,
        status: 'Pendiente',
        progress: 0,
        startDate: new Date().toLocaleDateString('es-ES'),
        endDate: new Date(Date.now() + 30 * 86400000).toLocaleDateString('es-ES')
    };
    
    planningTasks.push(nuevaTarea);
    document.getElementById('presupuestoPlan').textContent = `$${parseInt(presupuesto).toLocaleString()}`;
    document.getElementById('formPlanificacion').reset();
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
            updateAllDisplays();
            updateAllCharts();
        }
        
        if (Math.random() > 0.95) {
            generateControlAlerts();
            updateControlAlertsTable();
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
    
    // Riesgos
    animateNumber('riesgosCriticos', risks.filter(r => r.level === 'Crítico').length);
    animateNumber('riesgosAltos', risks.filter(r => r.level === 'Alto').length);
    animateNumber('riesgosMitigados', risks.filter(r => r.status === 'Mitigado').length);
    animateNumber('indiceResiliencia', randomBetween(75, 95), '%');
    
    // Diseño
    animateNumber('arquitecturasActivas', designServices.length);
    animateNumber('disenosAprobados', designServices.filter(d => d.status === 'Aprobado').length);
    animateNumber('disenosEnProceso', designServices.filter(d => d.status === 'En Revisión').length);
    animateNumber('cumplimientoDiseno', randomBetween(85, 98), '%');
    
    // Transición
    animateNumber('desplieguesTotal', transitions.length);
    animateNumber('desplieguesExitosos', transitions.filter(t => t.status === 'Completado').length);
    animateNumber('cambiosPendientes', transitions.filter(t => t.status === 'Aprobado').length);
    const tasaExito = transitions.length > 0 ? Math.round((transitions.filter(t => t.status === 'Completado').length / transitions.length) * 100) : 0;
    animateNumber('tasaExitoTransicion', tasaExito, '%');
    
    // Mejora Continua
    animateNumber('iniciativasMejora', randomBetween(8, 15));
    animateNumber('mejorasImplementadas', randomBetween(12, 25));
    animateNumber('kpisMejora', randomBetween(18, 24));
    animateNumber('impactoMejora', randomBetween(75, 95), '%');
    
    // Seguridad
    animateNumber('controlesActivos', randomBetween(45, 65));
    animateNumber('cumplimientoISO', randomBetween(85, 98), '%');
    animateNumber('vulnerabilidades', randomBetween(2, 12));
    animateNumber('incidentesSeguridad', randomBetween(0, 5));
    
    // Centro de Control
    animateNumber('servidoresActivos', randomBetween(12, 18));
    animateNumber('serviciosOperativos', randomBetween(95, 100), '%');
    animateNumber('usoCPU', randomBetween(35, 75), '%');
    animateNumber('usoMemoria', randomBetween(40, 80), '%');
    
    updateTrafficLight(satisfaction);
    
    const globalProgress = randomBetween(80, 95);
    updateProgressBar('progressGlobal', 'progressGlobalText', globalProgress);
}

// ===== ACTUALIZACIÓN DE TODOS LOS DISPLAYS =====
function updateAllDisplays() {
    updateTicketsTable();
    updatePlanningTable();
    updatePlanificacionMetrics();
    updateRisksTable();
    updateDesignTable();
    updateTransitionTable();
    updateSecurityTable();
    updateControlAlertsTable();
}

// ===== TABLAS =====
function updateTicketsTable() {
    const tbody = document.getElementById('tablaTickets');
    tbody.innerHTML = '';
    
    tickets.slice(-25).reverse().forEach(ticket => {
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

function updateSecurityTable() {
    const tbody = document.getElementById('tablaSeguridad');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    securityAudits.forEach(audit => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${audit.id}</strong></td>
            <td><span class="badge badge-info">${audit.type}</span></td>
            <td>${audit.area}</td>
            <td><span class="badge badge-${getAuditResultClass(audit.result)}">${audit.result}</span></td>
            <td><strong>${audit.findings}</strong></td>
            <td>${audit.date}</td>
        `;
        tbody.appendChild(row);
    });
}

function updateControlAlertsTable() {
    const tbody = document.getElementById('tablaAlertas');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    controlAlerts.slice(-15).reverse().forEach(alert => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${alert.timestamp}</strong></td>
            <td><span class="badge badge-${getSeverityClass(alert.type)}">${alert.type}</span></td>
            <td>${alert.origin}</td>
            <td>${alert.message}</td>
            <td><span class="badge badge-${getSeverityClass(alert.severity)}">${alert.severity}</span></td>
            <td><span class="badge badge-primary">${alert.status}</span></td>
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

// ===== FILTRADO =====
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

function filterRisks(filter) {
    const tbody = document.getElementById('tablaRiesgos');
    if (!tbody) return;
    const rows = tbody.getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        if (filter === 'all') {
            row.style.display = '';
        } else {
            const levelCell = row.cells[5];
            const level = levelCell.textContent.trim();
            row.style.display = level.includes(filter) ? '' : 'none';
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

function getImpactClass(impact) {
    const map = { 'Crítico': 'danger', 'Alto': 'warning', 'Medio': 'info', 'Bajo': 'success' };
    return map[impact] || 'info';
}

function getProbabilityClass(probability) {
    const map = { 'Alta': 'danger', 'Media': 'warning', 'Baja': 'success' };
    return map[probability] || 'info';
}

function getRiskLevelClass(level) {
    const map = { 'Crítico': 'danger', 'Alto': 'warning', 'Medio': 'info', 'Bajo': 'success' };
    return map[level] || 'info';
}

function getDesignStatusClass(status) {
    const map = { 'Aprobado': 'success', 'En Revisión': 'warning', 'Diseño Completado': 'info' };
    return map[status] || 'info';
}

function getTransitionStatusClass(status) {
    const map = { 'Completado': 'success', 'En Ejecución': 'warning', 'Aprobado': 'info', 'Rechazado': 'danger' };
    return map[status] || 'info';
}

function getAuditResultClass(result) {
    const map = { 'Satisfactorio': 'success', 'Con Observaciones': 'warning', 'Requiere Mejoras': 'danger' };
    return map[result] || 'info';
}

function getSeverityClass(severity) {
    const map = { 'Critical': 'danger', 'Error': 'danger', 'Warning': 'warning', 'Info': 'info' };
    return map[severity] || 'info';
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

// ===== INICIALIZACIÓN DE GRÁFICOS =====
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
    
    // 10. Gráfico de Planificación
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
    
    // 11. Gráfico de Tickets
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

    // 12. Gráficos de Diseño
    const ctxArq = document.getElementById('chartArquitectura');
    if (ctxArq) {
        charts.arquitectura = new Chart(ctxArq, {
            type: 'bar',
            data: {
                labels: ['Aplicación', 'Infraestructura', 'Datos', 'Seguridad', 'Integración'],
                datasets: [{
                    label: 'Servicios',
                    data: [8, 5, 4, 6, 3],
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgb(52, 152, 219)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });
    }

    const ctxCapDiseno = document.getElementById('chartCapacidadDiseno');
    if (ctxCapDiseno) {
        charts.capacidadDiseno = new Chart(ctxCapDiseno, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Disponibilidad %',
                    data: [99.2, 99.5, 99.8, 99.3, 99.6, 99.9, 99.7],
                    borderColor: 'rgb(46, 204, 113)',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { min: 98, max: 100, ticks: { color: textColor }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });
    }

    // 13. Gráficos de Transición
    const ctxCambios = document.getElementById('chartCambios');
    if (ctxCambios) {
        charts.cambios = new Chart(ctxCambios, {
            type: 'doughnut',
            data: {
                labels: ['Aprobado', 'En Ejecución', 'Completado', 'Rechazado'],
                datasets: [{
                    data: [3, 4, 8, 1],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(241, 196, 15, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(231, 76, 60, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: textColor, padding: 8, font: { size: 10 } } }
                }
            }
        });
    }

    const ctxDespliegues = document.getElementById('chartDespliegues');
    if (ctxDespliegues) {
        charts.despliegues = new Chart(ctxDespliegues, {
            type: 'bar',
            data: {
                labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                datasets: [{
                    label: 'Exitosos',
                    data: [5, 7, 6, 8],
                    backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    borderColor: 'rgb(46, 204, 113)',
                    borderWidth: 2
                }, {
                    label: 'Fallidos',
                    data: [1, 0, 2, 1],
                    backgroundColor: 'rgba(231, 76, 60, 0.7)',
                    borderColor: 'rgb(231, 76, 60)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { labels: { color: textColor } } },
                scales: {
                    y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });
    }

    // 14. Gráficos de Mejora Continua
    const ctxKPIs = document.getElementById('chartKPIs');
    if (ctxKPIs) {
        charts.kpis = new Chart(ctxKPIs, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Cumplimiento',
                    data: [78, 82, 85, 88, 91, 94],
                    borderColor: 'rgb(52, 152, 219)',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { color: textColor }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });
    }

    const ctxIniciativas = document.getElementById('chartIniciativas');
    if (ctxIniciativas) {
        charts.iniciativas = new Chart(ctxIniciativas, {
            type: 'pie',
            data: {
                labels: ['Implementadas', 'En Progreso', 'Planificadas'],
                datasets: [{
                    data: [12, 8, 5],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(241, 196, 15, 0.8)',
                        'rgba(52, 152, 219, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: textColor, padding: 8, font: { size: 10 } } }
                }
            }
        });
    }

    // 15. Gráficos de Riesgos Adicionales
    const ctxMatrizRiesgos = document.getElementById('chartMatrizRiesgos');
    if (ctxMatrizRiesgos) {
        charts.matrizRiesgos = new Chart(ctxMatrizRiesgos, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Riesgos',
                    data: [
                        { x: 3, y: 4 }, { x: 2, y: 3 }, { x: 1, y: 2 },
                        { x: 3, y: 2 }, { x: 2, y: 4 }, { x: 1, y: 3 },
                        { x: 2, y: 2 }, { x: 3, y: 3 }
                    ],
                    backgroundColor: 'rgba(231, 76, 60, 0.6)',
                    borderColor: 'rgb(231, 76, 60)',
                    pointRadius: 8,
                    pointHoverRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        title: { display: true, text: 'Impacto', color: textColor },
                        min: 0,
                        max: 5,
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    },
                    x: {
                        title: { display: true, text: 'Probabilidad', color: textColor },
                        min: 0,
                        max: 4,
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    }
                }
            }
        });
    }

    const ctxCategoriasRiesgo = document.getElementById('chartCategoriasRiesgo');
    if (ctxCategoriasRiesgo) {
        charts.categoriasRiesgo = new Chart(ctxCategoriasRiesgo, {
            type: 'pie',
            data: {
                labels: ['Seguridad', 'Operacional', 'Estratégico', 'Cumplimiento', 'Financiero'],
                datasets: [{
                    data: [8, 5, 4, 6, 3],
                    backgroundColor: [
                        'rgba(231, 76, 60, 0.8)',
                        'rgba(243, 156, 18, 0.8)',
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(155, 89, 182, 0.8)',
                        'rgba(46, 204, 113, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: textColor, padding: 8, font: { size: 10 } } }
                }
            }
        });
    }

    // 16. Gráficos de Seguridad
    const ctxVulnerabilidades = document.getElementById('chartVulnerabilidades');
    if (ctxVulnerabilidades) {
        charts.vulnerabilidades = new Chart(ctxVulnerabilidades, {
            type: 'bar',
            data: {
                labels: ['Críticas', 'Altas', 'Medias', 'Bajas'],
                datasets: [{
                    label: 'Cantidad',
                    data: [2, 5, 12, 18],
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
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { color: textColor, stepSize: 2 }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });
    }

    const ctxControles = document.getElementById('chartControles');
    if (ctxControles) {
        charts.controles = new Chart(ctxControles, {
            type: 'doughnut',
            data: {
                labels: ['Implementados', 'En Progreso', 'Planificados'],
                datasets: [{
                    data: [45, 12, 8],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(241, 196, 15, 0.8)',
                        'rgba(52, 152, 219, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: textColor, padding: 8, font: { size: 10 } } }
                }
            }
        });
    }

    const ctxIncidentesSeguridad = document.getElementById('chartIncidentesSeguridad');
    if (ctxIncidentesSeguridad) {
        charts.incidentesSeguridad = new Chart(ctxIncidentesSeguridad, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Incidentes',
                    data: [5, 3, 4, 2, 1, 3],
                    borderColor: 'rgb(231, 76, 60)',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { color: textColor, stepSize: 1 }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });
    }

    const ctxCumplimientoNormativo = document.getElementById('chartCumplimientoNormativo');
    if (ctxCumplimientoNormativo) {
        charts.cumplimientoNormativo = new Chart(ctxCumplimientoNormativo, {
            type: 'bar',
            data: {
                labels: ['ISO 27001', 'GDPR', 'SOC 2', 'PCI DSS'],
                datasets: [{
                    label: 'Cumplimiento %',
                    data: [95, 88, 92, 85],
                    backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    borderColor: 'rgb(46, 204, 113)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { color: textColor }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });
    }

    // 17. Gráficos del Centro de Control
    const ctxMetricasControl = document.getElementById('chartMetricasControl');
    if (ctxMetricasControl) {
        charts.metricasControl = new Chart(ctxMetricasControl, {
            type: 'line',
            data: {
                labels: Array.from({length: 20}, (_, i) => `${i}:00`),
                datasets: [{
                    label: 'CPU %',
                    data: Array.from({length: 20}, () => randomBetween(30, 70)),
                    borderColor: 'rgb(52, 152, 219)',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }, {
                    label: 'Memoria %',
                    data: Array.from({length: 20}, () => randomBetween(40, 80)),
                    borderColor: 'rgb(231, 76, 60)',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: textColor, padding: 10 } }
                },
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { color: textColor }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor, maxTicksLimit: 10 }, grid: { color: gridColor } }
                }
            }
        });
    }

    const ctxRecursos = document.getElementById('chartRecursos');
    if (ctxRecursos) {
        charts.recursos = new Chart(ctxRecursos, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'CPU %',
                    data: [35, 40, 65, 72, 58, 45],
                    borderColor: 'rgb(52, 152, 219)',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }, {
                    label: 'RAM %',
                    data: [45, 48, 72, 78, 65, 52],
                    borderColor: 'rgb(155, 89, 182)',
                    backgroundColor: 'rgba(155, 89, 182, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }, {
                    label: 'Disco %',
                    data: [55, 56, 58, 62, 60, 58],
                    borderColor: 'rgb(241, 196, 15)',
                    backgroundColor: 'rgba(241, 196, 15, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: textColor, padding: 8, font: { size: 10 } } }
                },
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { color: textColor }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });
    }

    const ctxTrafico = document.getElementById('chartTrafico');
    if (ctxTrafico) {
        charts.trafico = new Chart(ctxTrafico, {
            type: 'bar',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Entrada (Mbps)',
                    data: [120, 80, 250, 380, 320, 180],
                    backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    borderColor: 'rgb(46, 204, 113)',
                    borderWidth: 2
                }, {
                    label: 'Salida (Mbps)',
                    data: [90, 60, 180, 280, 240, 140],
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgb(52, 152, 219)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: textColor, padding: 8, font: { size: 10 } } }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });
    }

    const ctxTemperatura = document.getElementById('chartTemperatura');
    if (ctxTemperatura) {
        charts.temperatura = new Chart(ctxTemperatura, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Temperatura °C',
                    data: [22, 21, 24, 26, 25, 23],
                    borderColor: 'rgb(231, 76, 60)',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { min: 18, max: 30, ticks: { color: textColor }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });
    }

    const ctxEnergia = document.getElementById('chartEnergia');
    if (ctxEnergia) {
        charts.energia = new Chart(ctxEnergia, {
            type: 'bar',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Consumo (kWh)',
                    data: [45, 38, 62, 75, 68, 52],
                    backgroundColor: 'rgba(241, 196, 15, 0.7)',
                    borderColor: 'rgb(241, 196, 15)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor }, grid: { color: gridColor } }
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
    
    // Actualizar Tendencia Mensual
    if (charts.tendencia) {
        const satisfaction = tickets.length > 0 
            ? Math.min(98, 80 + (tickets.filter(t => t.status === 'Cerrado').length / tickets.length) * 18)
            : randomBetween(80, 95);
        
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
    
    // Actualizar Nivel de Riesgos
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
    
    // Actualizar Gráfico de Tickets
    if (charts.tickets) {
        const abiertos = tickets.filter(t => t.status === 'Abierto').length;
        const cerrados = tickets.filter(t => t.status === 'Cerrado').length;
        
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
    
    // Actualizar Distribución de Servicios
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

    // Actualizar gráficos de Centro de Control
    if (charts.metricasControl) {
        charts.metricasControl.data.datasets[0].data.shift();
        charts.metricasControl.data.datasets[0].data.push(randomBetween(30, 70));
        charts.metricasControl.data.datasets[1].data.shift();
        charts.metricasControl.data.datasets[1].data.push(randomBetween(40, 80));
        charts.metricasControl.update('none');
    }

    // Actualizar categorías de riesgo
    if (charts.categoriasRiesgo) {
        const risksByCategory = {
            'Seguridad': risks.filter(r => r.category === 'Seguridad').length,
            'Operacional': risks.filter(r => r.category === 'Operacional').length,
            'Estratégico': risks.filter(r => r.category === 'Estratégico').length,
            'Cumplimiento': risks.filter(r => r.category === 'Cumplimiento').length,
            'Financiero': risks.filter(r => r.category === 'Financiero').length
        };
        
        charts.categoriasRiesgo.data.datasets[0].data = [
            risksByCategory['Seguridad'],
            risksByCategory['Operacional'],
            risksByCategory['Estratégico'],
            risksByCategory['Cumplimiento'],
            risksByCategory['Financiero']
        ];
        charts.categoriasRiesgo.update('none');
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
                    if (chart.options.scales[axis].title) {
                        chart.options.scales[axis].title.color = textColor;
                    }
                }
            });
        }
        
        chart.update();
    });
}
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

function updateRisksTable() {
    const tbody = document.getElementById('tablaRiesgos');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    risks.slice(-20).reverse().forEach(risk => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${risk.id}</strong></td>
            <td>${risk.description}</td>
            <td><span class="badge badge-info">${risk.category}</span></td>
            <td><span class="badge badge-${getImpactClass(risk.impact)}">${risk.impact}</span></td>
            <td><span class="badge badge-${getProbabilityClass(risk.probability)}">${risk.probability}</span></td>
            <td><span class="badge badge-${getRiskLevelClass(risk.level)}">${risk.level}</span></td>
            <td><span class="badge badge-primary">${risk.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function updateDesignTable() {
    const tbody = document.getElementById('tablaDiseno');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    designServices.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${service.id}</strong></td>
            <td>${service.name}</td>
            <td><span class="badge badge-info">${service.category}</span></td>
            <td><span class="badge badge-${getDesignStatusClass(service.status)}">${service.status}</span></td>
            <td><strong>${service.availability}</strong></td>
            <td>${service.lastReview}</td>
        `;
        tbody.appendChild(row);
    });
}

function updateTransitionTable() {
    const tbody = document.getElementById('tablaTransicion');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    transitions.forEach(transition => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${transition.id}</strong></td>
            <td>${transition.description}</td>
            <td><span class="badge badge-info">${transition.type}</span></td>
            <td><span class="badge badge-${getImpactClass(transition.impact)}">${transition.impact}</span></td>
            <td><span class="badge badge-${getTransitionStatusClass(transition.status)}">${transition.status}</span></td>
            <td>${transition.date}</td>
        `;
        tbody.appendChild(row);
    });
}
