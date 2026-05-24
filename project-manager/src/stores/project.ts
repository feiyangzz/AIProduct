import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project, ProjectForm } from '@/types'
import { projectApi } from '@/api'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)

  async function fetchProjects() {
    loading.value = true
    try {
      projects.value = await projectApi.getList()
    } finally {
      loading.value = false
    }
  }

  async function createProject(form: ProjectForm) {
    const project = await projectApi.create(form)
    projects.value.unshift(project)
    return project
  }

  async function updateProject(id: number, form: Partial<ProjectForm>) {
    const project = await projectApi.update(id, form)
    const index = projects.value.findIndex((p) => p.id === id)
    if (index !== -1) projects.value[index] = project
    return project
  }

  async function deleteProject(id: number) {
    await projectApi.delete(id)
    projects.value = projects.value.filter((p) => p.id !== id)
  }

  return { projects, loading, fetchProjects, createProject, updateProject, deleteProject }
})
