# 📘 EFACT – Prueba Técnica Frontend (Angular)

Aplicación desarrollada como parte de la **Prueba Técnica de Desarrollo Frontend** para EFACT.  
El proyecto implementa un flujo completo de autenticación y visualización de documentos electrónicos utilizando Angular y los endpoints proporcionados en el enunciado.

---

## 🚀 Funcionalidades principales

- ✅ Autenticación mediante formulario de login
- ✅ Obtención de **token OAuth** a través del servicio de EFACT
- ✅ Visualización de los tres documentos solicitados:
  - 📄 **PDF del comprobante**
  - 🧾 **XML firmado**
  - 📬 **CDR (Constancia de Recepción)**
- ✅ Descarga de documentos
- ✅ Navegación mediante pestañas (tabs)
- ✅ Cierre de sesión eliminando el token
- ✅ Manejo de errores en autenticación y carga de documentos

---

## 🧩 Tecnologías utilizadas

- **Angular 17+**
- **TypeScript**
- **RxJS**
- **Angular Router**
- **HttpClient**
- **Angular Dev Proxy** (para evitar CORS en desarrollo)
- **HTML / SCSS**

---

## 📄 Endpoints utilizados

### 🔐 Token
```
POST /oauth/token
```

### 📄 Documentos
```
GET /v1/pdf/{ticket}
GET /v1/xml/{ticket}
GET /v1/cdr/{ticket}
```

Todos los endpoints requieren autenticación via:  
`Authorization: Bearer {token}`

---

## 🧱 Arquitectura del proyecto
```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts          # Protección de rutas
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts    # Inyección automática de token
│   │   └── services/
│   │       ├── auth.service.ts        # Servicio de autenticación
│   │       └── document.service.ts    # Servicio de documentos
│   ├── features/
│   │   ├── login/                     # Componente de login
│   │   └── dashboard/                 # Visualizador de documentos
│   ├── app.config.ts                  # Configuración de la app
│   └── app.routes.ts                  # Definición de rutas
│
├── environments/
│   ├── environment.ts                 # Variables de desarrollo
│
└── styles.scss                        # Estilos globales
```

Estructura simple y modular para cumplir con los requisitos de la prueba.

---

## 🔧 Instalación y ejecución

### 1️⃣ Clonar repositorio
```bash
git clone https://github.com/ArturoRoncal2704/efact-prueba-tecnica.git
cd efact-prueba-tecnica
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Ejecutar servidor de desarrollo
```bash
ng serve -o
```

La aplicación estará disponible en `http://localhost:4200`

---

## ➕ Configuración del proxy (evita CORS en desarrollo)

Archivo `proxy.conf.json` en la raíz del proyecto:
```json
{
  "/api-efact-ose": {
    "target": "https://odin-dev.efact.pe",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

En `angular.json`, dentro de `"serve"`:
```json
"serve": {
  "builder": "@angular/build:dev-server",
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

Esto permite consumir la API mediante rutas internas como:
```
/api-efact-ose/oauth/token
/api-efact-ose/v1/pdf/{ticket}
```

---

## 🔑 Credenciales de prueba

Las credenciales fueron proporcionadas por EFACT para el desarrollo de esta prueba.  
Se cargan por defecto en el formulario únicamente para facilitar la evaluación, pero pueden ser editadas libremente.
```
Usuario (RUC): 20111193035
Contraseña: 61a77b6fda77c3a2d6b28930546c86d7f749ccf0bd4bad1e1192f13bb59f0f30
Ticket: 571cc3a3-5b1f-4855-af26-0de6e7c5475f
```

> **Nota:** Las credenciales no representan información sensible y provienen del documento oficial de la prueba técnica.

---

## ✔️ Flujo funcional implementado

### 1. Login
- Formulario de usuario y contraseña
- Manejo de errores en tiempo real
- Consumo del servicio OAuth
- Almacenamiento de token en `localStorage`

### 2. Protección de rutas
- `AuthGuard` evita que usuarios sin token ingresen a `/dashboard`

### 3. Visualizador de documentos
Tres pestañas:
- **PDF**: Visor embebido + descarga
- **XML**: Renderizado de texto + descarga
- **CDR**: Renderizado + descarga


### 4. Cerrar sesión
- Se elimina el token y se redirige a la pantalla de login
