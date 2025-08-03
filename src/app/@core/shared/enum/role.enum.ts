export enum RoleEnum {
  ROOT = 'root',
  ADMINISTRADOR = 'administrador',
  ESTUDIANTE = 'estudiante',
}

/**
 * Obtiene un array con los valores del enum.
 * @returns string[]
 */
export const getRoleValues = (): string[] => {
  return Object.values(RoleEnum);
};

/**
 * Obtiene la etiqueta asociada a un valor del enum RoleEnum.
 * @param value Valor del enum RoleEnum.
 * @returns string Etiqueta asociada.
 */
export const getRoleLabel = (value: string): string => {
  const labels: Record<RoleEnum, string> = {
    [RoleEnum.ROOT]: 'Super Usuario',
    [RoleEnum.ADMINISTRADOR]: 'Administrador',
    [RoleEnum.ESTUDIANTE]: 'Estudiante',
  };

  return labels[value as RoleEnum] || 'DESCONOCIDO';
};
