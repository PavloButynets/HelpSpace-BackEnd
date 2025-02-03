export const getUniqueFields = (message: string): string => {
    const contentMatch = message.match(/\{([^{}]*?)\}/)
    const content = contentMatch ? contentMatch[1] : ''
  
    const uniqueFields = content.match(/\b(\w+)(?=:)/g)
    return uniqueFields ? uniqueFields.join(', ') : ''
  }

  