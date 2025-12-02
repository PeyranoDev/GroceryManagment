export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nueva funcionalidad
        'fix',      // Corrección de bug
        'docs',     // Documentación
        'style',    // Formato (no afecta código)
        'refactor', // Refactorización de código
        'perf',     // Mejora de rendimiento
        'test',     // Añadir/modificar tests
        'build',    // Cambios en build system
        'ci',       // Cambios en CI/CD
        'chore',    // Tareas de mantenimiento
        'revert',   // Revertir cambios
      ],
    ],
    'subject-case': [0], // Desactivar para permitir cualquier case
    'body-max-line-length': [0], // Desactivar límite de línea en body
  },
};
