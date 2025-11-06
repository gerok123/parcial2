<script setup lang="ts">
import type { NivelAcademico } from '@/models/nivel-academico' // Asegúrate de que esta ruta sea correcta
import type { Programa, EstadoPrograma } from '@/models/programa' // Asegúrate de que esta ruta sea correcta
import http from '@/plugins/axios'
import {
  Button,
  Dialog,
  InputNumber, // Para versión, duración, costo
  InputText,
  Select, // Renombrado a Dropdown para claridad, pero usa 'Select' de primevue
  Dropdown,
  Textarea,
  Calendar, // Para fechaInicio
} from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'programas'

// Estado del Programa (para el Dropdown)
const ESTADOS_PROGRAMA: EstadoPrograma[] = ['En Planificación', 'En curso', 'Finalizado']

const props = defineProps({
  mostrar: Boolean,
  programa: {
    type: Object as () => Programa,
    default: () => ({}) as Programa,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

// Listas para Selects
const nivelesAcademicos = ref<NivelAcademico[]>([])

// Datos del formulario
const programa = ref<Programa>({ ...props.programa })

// Lógica de diálogo
const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

// Observador para actualizar el formulario cuando cambian las props
watch(
  () => props.programa,
  (newVal) => {
    // Si la nueva prop tiene datos (modo edición), copiamos el objeto
    if (newVal && newVal.id) {
      // Necesitamos clonar el objeto y asegurarnos de que fechaInicio sea un objeto Date si estamos en edición
      programa.value = {
        ...newVal,
        fechaInicio: newVal.fechaInicio ? new Date(newVal.fechaInicio) : new Date(), // Usar new Date() como fallback
      }
    } else {
      // Si estamos en creación, inicializamos limpio
      programa.value = {
        id: 0,
        idNivelAcademico: 0,
        nombre: '',
        descripcion: '',
        version: 1,
        duracionMeses: 1,
        costo: 0,
        fechaInicio: new Date(),
        estado: 'En Planificación',
      } as Programa
    }
  },
  { deep: true },
)


async function obtenerNivelesAcademicos() {
  try {
    nivelesAcademicos.value = await http.get('niveles-academicos').then((response) => response.data)
  } catch (error) {
    console.error('Error al cargar niveles académicos:', error)
  }
}

// --- Métodos de Guardado ---

async function handleSave() {
  try {
    // 1. Crear el body con los datos exactos que espera el DTO del backend
    const body = {
      idNivelAcademico: programa.value.idNivelAcademico,
      nombre: programa.value.nombre,
      descripcion: programa.value.descripcion,
      version: programa.value.version,
      duracionMeses: programa.value.duracionMeses,
      costo: programa.value.costo,
      fechaInicio: programa.value.fechaInicio ? programa.value.fechaInicio.toISOString() : null,
      estado: programa.value.estado,
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${programa.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    // 2. Notificar al padre, limpiar y cerrar
    emit('guardar')
    // Limpieza (el watch se encargará de resetear si se vuelve a abrir en modo creación)
    programa.value = {} as Programa
    dialogVisible.value = false
  } catch (error: any) {
    // Muestra el error de validación o del servidor
    alert(error?.response?.data?.message || 'Error desconocido al guardar el programa.')
  }
}

// --- Lógica de Inicialización al Abrir ---

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerNivelesAcademicos()

      // Si NO estamos en edición, reinicializamos el objeto para asegurar valores por defecto limpios
      if (!props.programa?.id) {
         programa.value = {
            id: 0,
            idNivelAcademico: 0,
            nombre: '',
            descripcion: '',
            version: 1,
            duracionMeses: 1,
            costo: 0,
            fechaInicio: new Date(),
            estado: 'En Planificación',
        } as Programa
      }
    }
  },
  { immediate: true })
</script>

<template>
  <div class="card flex justify-content-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Programa' : 'Crear Programa'"
      style="width: 35rem"
      modal
    >
      <div class="p-fluid">
        <div class="field mb-4">
          <label for="nivelAcademico" class="font-semibold w-full">Nivel Académico</label>
          <Dropdown
            id="nivelAcademico"
            v-model="programa.idNivelAcademico"
            :options="nivelesAcademicos"
            optionLabel="nombre"
            optionValue="id"
            class="w-full"
            placeholder="Seleccione un Nivel Académico"
            required
            autofocus
          />
        </div>

        <div class="field mb-4">
          <label for="nombre" class="font-semibold w-full">Nombre del Programa</label>
          <InputText
            id="nombre"
            v-model="programa.nombre"
            class="w-full"
            autocomplete="off"
            maxlength="100"
            required
          />
        </div>

        <div class="field mb-4">
          <label for="descripcion" class="font-semibold w-full">Descripción</label>
          <Textarea
            id="descripcion"
            v-model="programa.descripcion"
            class="w-full"
            autocomplete="off"
            rows="5"
            maxlength="2000"
            :auto-resize="true"
          />
        </div>

        <div class="field mb-4">
          <label for="version" class="font-semibold w-full">Versión</label>
          <InputNumber
            id="version"
            v-model="programa.version"
            mode="decimal"
            :min="1"
            :max="999"
            showButtons
            required
          />
        </div>

        <div class="field mb-4">
          <label for="duracionMeses" class="font-semibold w-full">Duración (Meses)</label>
          <InputNumber
            id="duracionMeses"
            v-model="programa.duracionMeses"
            mode="decimal"
            :min="1"
            :max="120"
            showButtons
            required
          />
        </div>

        <div class="field mb-4">
          <label for="costo" class="font-semibold w-full">Costo</label>
          <InputNumber
            id="costo"
            v-model="programa.costo"
            mode="currency"
            currency="BOB"
            locale="es-BO"
            :min="0"
            :maxFractionDigits="2"
            required
          />
        </div>

        <div class="field mb-4">
          <label for="fechaInicio" class="font-semibold w-full">Fecha de Inicio</label>
          <Calendar
            id="fechaInicio"
            v-model="programa.fechaInicio"
            dateFormat="dd/mm/yy"
            showIcon
            required
          />
        </div>

        <div class="field mb-4">
          <label for="estado" class="font-semibold w-full">Estado</label>
          <Dropdown
            id="estado"
            v-model="programa.estado"
            :options="ESTADOS_PROGRAMA"
            class="w-full"
            placeholder="Seleccione el estado"
            required
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2">
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            @click="dialogVisible = false"
          ></Button>
          <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>

.field {
  margin-bottom: 1.5rem;
}
.p-fluid .field > label {
    display: block;
    margin-bottom: 0.5rem;
}
</style>