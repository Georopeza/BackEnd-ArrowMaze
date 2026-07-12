# Fixtures de contrato

Los archivos de este directorio son el fixture de la prueba de contrato del
DTO de nivel (`docs/contract/level.contract.ts` ↔
`Arrow-Maze-Escape-Puzzle/lib/contract/level_contract.dart`).

`simple-1.json` debe mantenerse **idéntico** al archivo del mismo nombre en
`Arrow-Maze-Escape-Puzzle/docs/levels/simple-1.json`. Ambos repos lo leen en
sus propios tests (`tests/unit/infrastructure/LevelJsonMapper.spec.ts` aquí;
`test/interface_adapters/level_dto_mapper_test.dart` y
`test/infrastructure/level/remote_level_repository_test.dart` en el
frontend) para verificar que su propio mapeo JSON → dominio sigue siendo
compatible con el contrato compartido. Al ser dos repos independientes sin
pipeline compartido, no hay sincronización automática: quien edite este
archivo en un lado debe replicar el cambio en el otro.
