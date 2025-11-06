<script setup lang="ts">
import type { NivelAcademico } from '@/models/nivel-academico'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'niveles-academicos'
const nivelesAcademicos = ref<NivelAcademico[]>([])
const NivelAcademicoDelete = ref<NivelAcademico | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')
const emit = defineEmits(['edit'])

const nivelesAcademicosFiltrados = computed(() => {
  return nivelesAcademicos.value.filter(
    (nivelesAcademicos) =>
      nivelesAcademicos.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})

async function obtenerLista() {
  nivelesAcademicos.value = await http.get(ENDPOINT).then((response) => response.data)
}

function emitirEdicion(NivelAcademico: NivelAcademico) {
  emit('edit', NivelAcademico)
}

function mostrarEliminarConfirm(nivelAcademico: NivelAcademico) {
  NivelAcademicoDelete.value = nivelAcademico
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${NivelAcademicoDelete.value?.id}`)
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
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre" />
      </InputGroup>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Nombre</th>
          <th>Descripcion</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(nivelAcademico, index) in nivelesAcademicosFiltrados" :key="nivelAcademico.id">
          <td>{{ index + 1 }}</td>
          <td>{{ nivelAcademico.nombre }}</td>
          <td>{{ nivelAcademico.descripcion }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(nivelAcademico)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(nivelAcademico)"
            />
          </td>
        </tr>
        <tr v-if="nivelesAcademicosFiltrados.length === 0">
          <td colspan="4">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar el artista {{ NivelAcademicoDelete?.nombre }}?</p>
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
