<script setup lang="ts">
import type { Programa } from '@/models/programa'
import http from '@/plugins/axios'
import { Button, Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'programas'
const programas = ref<Programa[]>([])
const programaDelete = ref<Programa | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')
const emit = defineEmits(['edit'])

const programasFiltradas = computed(() => {
  return programas.value.filter(
    (programa) =>
      programa.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      programa.nivelAcademico?.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

async function obtenerLista() {
  programas.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(programa: Programa) {
  emit('edit', programa)
}

function mostrarEliminarConfirm(programa: Programa) {
  programaDelete.value = programa
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${programaDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText
          v-model="busqueda"
          type="text"
          placeholder="Buscar por Programa o nivel academico"
        />
      </InputGroup>
    </div>

    <table v-if="true">
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Nombre</th>
          <th>Nivel Academico</th>
          <th>Version</th>
          <th>Duración (Meses)</th>
          <th>Costo</th>
          <th>Fecha Inicio</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(programa, index) in programasFiltradas" :key="programa.id">
          <td>{{ index + 1 }}</td>
          <td>{{ programa.nombre }}</td>
          <td>{{ programa.nivelAcademico?.nombre }}</td>
          <td>{{ programa.version }}</td>
          <td>{{ programa.duracionMeses }}</td>
          <td>{{ programa.costo }}</td>
          <td>{{ programa.fechaInicio }}</td>
          <td>{{ programa.estado }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(programa)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(programa)"
            />
          </td>
        </tr>
        <tr v-if="programasFiltradas.length === 0">
          <td colspan="7">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar el programa {{ programaDelete?.nombre }}?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
