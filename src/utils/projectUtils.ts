interface ProjectConfig {
  projectName: string
  companyName: string
  blockName: string
  siteName: string
  gpsCoordinates: string
}

export const saveProjectConfig = async (config: ProjectConfig): Promise<void> => {
  const configString = JSON.stringify(config, null, 2)
  const blob = new Blob([configString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${config.projectName.toLowerCase().replace(/\s+/g, '-')}.conf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const loadProjectConfig = async (file: File): Promise<ProjectConfig> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string)
        resolve(config)
      } catch (error) {
        reject(new Error('Invalid configuration file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}