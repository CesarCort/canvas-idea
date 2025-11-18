# 📄 Documento de requerimientos funcionales y técnicos
**Versión 0.1 – MVP "Canvas IA"** (uso personal, open source, solo frontend)

---

## 1. Contexto y Alcance

### 1.1. Idea general

Construir una herramienta tipo "canvas IA" donde una persona pueda:
- Pegar o escribir un texto base (ej: un brief, un artículo, un mail largo…).
- Hacer múltiples preguntas sobre ese mismo texto.
- Ver respuestas en bloques/nodos conectados en un canvas visual (usando React Flow).
- Generar:
  - resúmenes en key points, y
  - una versión estilo pitch (más narrativa/comercial),
- Generar varias imágenes a la vez relacionadas al contenido o al pitch.
- Reorganizar todo visualmente arrastrando nodos en el canvas.

La primera versión será:
- 🔹 Uso personal (cada usuario se descarga/usa la app y pone su propia API key).
- 🔹 100% frontend (SPA sin backend propio).
- 🔹 Open source (pensado para que cualquiera pueda forkarlo y correrlo localmente o en GitHub Pages/Vercel).

Más adelante se evaluará una versión con backend, multiusuario, etc. Fuera de alcance de este documento.

---

## 2. Objetivos del MVP

1. Permitir a un usuario explorar un texto de forma visual mediante preguntas/respuestas conectadas en un canvas.
2. Ofrecer acciones IA predefinidas:
   - Preguntas sobre el texto.
   - Resumen en key points.
   - Versión pitch.
   - Generación de imágenes múltiples.
3. Mantener todo dentro de una experiencia visual basada en React Flow:
   - Nodos arrastrables.
   - Conexiones entre nodos.
   - Estado de cada nodo (pendiente, generando, listo, error).
4. Permitir la configuración de:
   - API key de OpenRouter (o similar).
   - Modelo de texto.
   - Modelo de imágenes.
5. Persistir los "boards" de forma local (ej. localStorage), para que el usuario:
   - pueda abrir/cargar trabajos previos, y
   - no dependa de un backend.

---

## 3. Alcance Funcional

### 3.1. Framework y stack técnico (decisión)

- **Framework de frontend:**
  - 🎯 Vite + React + TypeScript (SPA, sin backend).
- **Librerías principales:**
  - React Flow → canvas visual, nodos, edges.
  - Zustand (o similar) → manejo de estado global de:
    - nodos,
    - edges,
    - estado de carga de cada nodo,
    - configuración global (modelo, API key, etc.).
  - Opcional (para UI):
    - Algún kit ligero de componentes (ej: Radix UI, Mantine, Chakra, MUI… o algo custom minimal).

**Nota:** El objetivo es que el repositorio sea fácil de clonar y levantar con `npm install && npm run dev`.

---

### 3.2. Configuración de API y modelos

#### 3.2.1. Pantalla / sección de configuración

Debe existir una sección accesible desde la UI (por ejemplo, en un icono de "⚙️ Config") que permita:
- **Ingresar la API key de OpenRouter** (o proveedor similar):
  - Input de texto con opción de "ocultar/mostrar".
  - Guardar en localStorage (advertir que se guarda localmente en el navegador).
- **Seleccionar modelo de texto:**
  - Dropdown con opciones configurables (ej:
    - gpt-4.1-mini,
    - gpt-4.1,
    - llama-3.1-70b,
    - etc.).
- **Seleccionar modelo de imágenes:**
  - Dropdown con modelos disponibles según el proveedor (ej:
    - openai/gpt-image-1,
    - stability/stable-diffusion,
    - etc.).
- **Parámetros mínimos de generación de texto:**
  - Temperatura (slider o input numérico).
  - Máx. tokens opcional.

#### 3.2.2. Validación básica

- **Si no hay API key:**
  - Deshabilitar botones que llaman a IA.
  - Mostrar un mensaje claro tipo: "Configura tu API key en Ajustes para usar la IA".
- **Manejo de errores de red o API:**
  - Si el call falla, el nodo pasa a estado error y muestra el mensaje devuelto (si es breve) o un mensaje genérico.

---

### 3.3. Estructura general de la UI

#### 3.3.1. Layout base

Dividir la interfaz en 3 zonas:

1. **Header (barra superior):**
   - Nombre del proyecto/board.
   - Botones:
     - "Nuevo board".
     - "Guardar board".
     - "Cargar board" (selector simple).
     - Acceso a Configuración (icono ⚙️).

2. **Panel lateral izquierdo (opcional pero recomendado):**
   - Área para pegar/escribir el texto base (documento fuente).
   - Botones de acciones globales:
     - "Generar preguntas sugeridas" (opcional, futuro).
     - "Crear nodo de resumen (key points)".
     - "Crear nodo de pitch".
     - "Crear nodo de imágenes".

3. **Canvas central (React Flow):**
   - Aquí se muestran:
     - Nodos de texto, preguntas, respuestas, resúmenes, pitch, imágenes.
   - Permite:
     - Pan (arrastrar fondo).
     - Zoom (wheel, +/–).
     - Seleccionar, mover y eliminar nodos.
     - Conectar nodos mediante edges.

#### 3.3.2. Panel lateral derecho (inspector de nodo) – opcional para el MVP, pero deseable

- Cuando un nodo está seleccionado:
  - Mostrar sus propiedades:
    - Título.
    - Tipo de nodo.
    - Texto asociado / prompt.
    - Parámetros específicos (si existen).

---

### 3.4. Tipos de Nodos (React Flow)

#### 3.4.1. Nodo: Texto Base ("Source Node")

- **Función:** Contener el texto original sobre el que se va a trabajar.
- **Comportamiento:**
  - Contiene un área editable (similar a textarea, pero se puede editar tanto en panel lateral como en el propio nodo o sólo en el panel, a decisión de UX).
  - Permite copiar el texto fácilmente.
- **Conexiones:**
  - Outputs: Puede conectarse a:
    - Nodos de Pregunta.
    - Nodos de Resumen.
    - Nodos de Pitch.
    - Nodos de Imágenes.
  - No requiere inputs.

#### 3.4.2. Nodo: Pregunta ("Question Node")

- **Función:** Representa una pregunta específica sobre uno o varios textos/nodos.
- **Contenido:**
  - Campo de texto corto: la pregunta.
  - Botón: "Generar respuesta".
- **Conexiones:**
  - Puede tener como input:
    - Nodo de Texto Base.
    - Otros nodos que se quieran usar como contexto (ej: un resumen).
  - Al generar respuesta, el sistema crea automáticamente uno o varios nodos de Respuesta vinculados.
- **Estados:**
  - idle, loading, done, error.

#### 3.4.3. Nodo: Respuesta ("Answer Node")

- **Función:** Muestra la respuesta del modelo a una pregunta.
- **Contenido:**
  - Texto resultante (markdown simple o texto plano).
  - Botón:
    - "Copiar texto".
    - "Regenerar" (opcional).
- **Conexiones:**
  - Input: desde la Pregunta correspondiente.
  - Output: puede servir de input a otros nodos (por ejemplo, a un nodo de resúmenes o pitch).

#### 3.4.4. Nodo: Resumen (Key Points)

- **Función:** Generar un resumen en bullet points (key points) a partir de:
  - Texto base, o
  - una selección de nodos (texto + respuestas, etc.).
- **Contenido:**
  - Panel con:
    - configuración simple (cantidad aproximada de bullets),
    - botón "Generar resumen".
  - Área de texto con los key points generados.
- **Conexiones:**
  - Inputs: uno o varios nodos (Text, Answer, incluso otros Summary).
  - Output: puede alimentar un nodo de Pitch.

#### 3.4.5. Nodo: Pitch

- **Función:** Crear una versión tipo pitch (ej: para presentar la idea a alguien más).
- **Contenido:**
  - Posibles modos predefinidos (selección):
    - "Pitch corto (1 min)".
    - "Pitch detallado (3 min)".
  - Botón: "Generar pitch".
  - Área de texto con el pitch.
- **Conexiones:**
  - Inputs: nodos de Resumen o directamente el Texto Base.
  - Output: puede alimentar un nodo de imágenes (para generar visuales alineados al pitch).

#### 3.4.6. Nodo: Imágenes

- **Función:** Generar múltiples imágenes basadas en:
  - Texto base, o
  - un resumen/pitch, o
  - un prompt específico añadido en el nodo.
- **Contenido:**
  - Campo "prompt visual" editable (puede inicializarse con texto proveniente de un nodo conectado).
  - Input numérico: cantidad de imágenes (ej: 1–6).
  - Botón: "Generar imágenes".
  - Grid de imágenes generadas (thumbnails clicables para ver en grande).
- **Conexiones:**
  - Inputs: nodos de Pitch, Resumen o Texto Base.
- **Estados:**
  - idle, loading, done, error.

---

### 3.5. Interacciones clave

#### 3.5.1. Crear un nuevo board

- Al entrar a la app:
  - Botón "Nuevo Board".
  - Crea un Board vacío con:
    - un nodo de Texto Base centrado en el canvas, o
    - sin nodos (y el usuario puede crear un nodo de Texto Base desde el panel lateral).
  - Debe asignarse un id simple (UUID o incremental).

#### 3.5.2. Guardar y cargar boards (local)

- **Guardar:**
  - Botón "Guardar Board".
  - Serializar:
    - nodos (con posiciones, tipos, contenidos),
    - edges (conexiones),
    - nombre del board.
  - Guardar en localStorage con una key que permita almacenar múltiples boards.
- **Cargar:**
  - Botón "Cargar Board".
  - Mostrar lista simple (nombre + fecha de última modificación).
  - Al seleccionar uno, se carga el estado completo en React Flow.

#### 3.5.3. Conexión de nodos (React Flow)

- Debe permitirse:
  - Arrastrar conexiones desde los handlers de salida a los handlers de entrada.
  - Validar conexiones:
    - Ejemplo: un nodo de Pregunta debe poder conectarse a un nodo de Texto Base, pero no necesariamente a un nodo de Imágenes (esto se puede definir en una función de validación).
  - No es necesario ejecutar "flujos automáticos". El foco del MVP es visual + llamadas puntuales por nodo.

#### 3.5.4. Ejecución de IA por nodo

- Al hacer clic en "Generar…" dentro de un nodo:
  - Verifica:
    - que haya API key,
    - que haya al menos un nodo de entrada válido (según el tipo).
  - Construye el prompt combinando:
    - texto de los nodos de entrada, y
    - las instrucciones del tipo de nodo (ej: "resume en bullet points", "genera un pitch corto", etc.).
  - Llama a OpenRouter.
  - Actualiza el nodo:
    - loading mientras espera,
    - done y llena el contenido al recibir la respuesta,
    - error si falla.

---

## 4. Requerimientos No Funcionales

### 4.1. Performance

- Debe funcionar fluidamente con:
  - ~30–50 nodos visibles sin lag notable.
  - Zoom y pan suaves.
- Evitar recomputaciones innecesarias:
  - Uso adecuado de memoización (React) y estructura de estado (Zustand).

### 4.2. Seguridad (limitada al contexto)

- La API key:
  - Se almacena solo en el navegador (localStorage).
  - No se envía a ningún backend adicional (solo al proveedor de IA).
- Mostrar advertencia:
  - En la sección de configuración, indicar que:
    - "Esta herramienta es de uso personal, tu API key se guarda en tu navegador y se envía directamente al proveedor de IA que configures".

### 4.3. Open Source

- Repositorio con:
  - Instrucciones claras de instalación y ejecución (README con pasos).
  - Archivo de configuración donde se puedan ajustar:
    - URL base del proveedor (OpenRouter u otro).
    - Lista de modelos sugeridos.
  - Código organizado por módulos:
    - /src/components
    - /src/canvas (nodos + edge config)
    - /src/state (Zustand)
    - /src/lib/api (funciones que llaman a IA)

---

## 5. Historias de Usuario (Resumen)

1. Como usuario, quiero pegar un texto en el panel izquierdo y visualizarlo en un nodo central para trabajar sobre ese contenido.
2. Como usuario, quiero crear varias preguntas sobre el mismo texto, cada una en un nodo distinto, y generar respuestas individuales.
3. Como usuario, quiero reordenar visualmente las preguntas y respuestas arrastrando nodos en el canvas.
4. Como usuario, quiero generar un resumen en key points de mi texto (y/o de algunas respuestas) y verlo como un nodo independiente.
5. Como usuario, quiero generar un pitch basado en el texto o su resumen para poder presentarlo a otra persona.
6. Como usuario, quiero generar varias imágenes a partir de un pitch o de un resumen y verlas como thumbnails en un nodo.
7. Como usuario, quiero poder guardar mi board y volver a cargarlo después para seguir trabajando.
8. Como usuario, quiero configurar mi API key y mi modelo sin tocar código, solo desde la interfaz.

---

## 6. Fuera de Alcance (por ahora)

- Autenticación de usuarios.
- Backend propio para guardar boards.
- Colaboración en tiempo real multiusuario.
- Control de cuotas o límites de uso de la API.
- Organización avanzada de proyectos (carpetas, tags, etc.).
