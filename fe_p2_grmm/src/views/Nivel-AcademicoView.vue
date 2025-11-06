<script setup lang="ts">
import NivelAcademicoList from '@/components/nivel-academico/Nivel-AcademicoList.vue'
import NivelAcademicoSave from '@/components/nivel-academico/Nivel-AcademicoSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const nivelAcademicoListRef = ref<typeof NivelAcademicoList | null>(null)
const nivelAcademicoEdit = ref<any>(null)

function handleCreate() {
  nivelAcademicoEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(nivelAcademico: any) {
  nivelAcademicoEdit.value = nivelAcademico
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  nivelAcademicoListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="mx-2 mt-6 md:m-7">
    <h2>Niveles Academicos</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <NivelAcademicoList ref="nivelAcademicoListRef" @edit="handleEdit" />
    <NivelAcademicoSave
      :mostrar="mostrarDialog"
      :nivelAcademico="nivelAcademicoEdit"
      :modoEdicion="!!nivelAcademicoEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
