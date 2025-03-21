export const formatFieldType = (fieldType: string) => {
  switch (fieldType) {
    case 'FUTBOL_5':
      return 'Fútbol 5'
    case 'FUTBOL_7':
      return 'Fútbol 7'
    case 'FUTSAL':
      return 'Futsal'
    case 'PADEL':
      return 'Pádel'
  }
}

export const formatSurfaceType = (surface: string) => {
  switch (surface) {
    case 'SYNTHETIC_GRASS':
      return 'Césped sintético'
    case 'NATURAL_GRASS':
      return 'Césped natural'
    case 'HARD_COURT':
      return 'Cancha de cemento'
  }
}
