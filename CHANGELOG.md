## [1.4.0](https://github.com/PeyranoDev/GroceryManagment/compare/v1.3.2...v1.4.0) (2025-12-04)

### ✨ Features

* SuperAdmin only has access to Users page, sees all users in system ([33c7d4c](https://github.com/PeyranoDev/GroceryManagment/commit/33c7d4c2180d80c89d223cca16ae2cf20ba4ac32))

## [1.3.2](https://github.com/PeyranoDev/GroceryManagment/compare/v1.3.1...v1.3.2) (2025-12-04)

### 🐛 Bug Fixes

* disable JWT claim mapping to preserve 'role' claim type ([05e2ddd](https://github.com/PeyranoDev/GroceryManagment/commit/05e2ddd36a14ca9f3e929fb7c33906848fa04076))

## [1.3.1](https://github.com/PeyranoDev/GroceryManagment/compare/v1.3.0...v1.3.1) (2025-12-04)

### ♻️ Code Refactoring

* cambiar logica de roles en frontend ([30fc584](https://github.com/PeyranoDev/GroceryManagment/commit/30fc584de10a3f8cacc0abeba79f0500eaeee3c7))

## [1.3.0](https://github.com/PeyranoDev/GroceryManagment/compare/v1.2.0...v1.3.0) (2025-12-04)

### ✨ Features

* **inventory:** add category selection to product creation ([5aa9d0d](https://github.com/PeyranoDev/GroceryManagment/commit/5aa9d0d7f997950219b3e9670867d8afc5785cda))

### ♻️ Code Refactoring

* refactorizar las entidades y eliminar IsSuperAdmin para usar Roles nada mas ([38c9f69](https://github.com/PeyranoDev/GroceryManagment/commit/38c9f692768cbaf6b012a958df309b4895a7a2bc))
* usar managed entity para keyvault en produccion ([05e5b19](https://github.com/PeyranoDev/GroceryManagment/commit/05e5b199b0b863e8f3cbb2126f4e9be96d1e54de))

## [1.2.0](https://github.com/PeyranoDev/GroceryManagment/compare/v1.1.0...v1.2.0) (2025-12-03)

### ✨ Features

* Servicio paralelo para llamadas http de dashboard ([4f1fe6a](https://github.com/PeyranoDev/GroceryManagment/commit/4f1fe6a987af977eb9d3216f5b1579f7415f02b5))
* **users:** implement user management with roles and activation ([f64c073](https://github.com/PeyranoDev/GroceryManagment/commit/f64c07312bdeab3da308b26d4d93e0d4236ceba8))

## [1.1.0](https://github.com/PeyranoDev/GroceryManagment/compare/v1.0.0...v1.1.0) (2025-12-03)

### ✨ Features

* persistencia de datos en frontend + manejo de roles ([08949f9](https://github.com/PeyranoDev/GroceryManagment/commit/08949f983a055375fcfd18179f3d55cf5ef82e70))
* primer modelo de mobile ([a98bbe7](https://github.com/PeyranoDev/GroceryManagment/commit/a98bbe708c3ece78d4a8f02a69bb874cb0529cfe))
* proteccion completa de rutas ([aaab446](https://github.com/PeyranoDev/GroceryManagment/commit/aaab4467b303124657d608071d3c84e9be5a0c60))

### ♻️ Code Refactoring

* Cambiar completamente las actividades recientes para mejor respuesta y complejidad ([46a200c](https://github.com/PeyranoDev/GroceryManagment/commit/46a200c6c5f4cb937869b1d8cd7a0a9db6b1a095))
* rehacer dashboard controller completo y UI para 1 sola llamada HTTP ([633149d](https://github.com/PeyranoDev/GroceryManagment/commit/633149d2c605f0b662330e852e67fcc4bb94a533))

## 1.0.0 (2025-12-02)

### ✨ Features

* auth completo ([67fe768](https://github.com/PeyranoDev/GroceryManagment/commit/67fe7684fc5b88a5d490d667733c7517b0a167c3))
* configuracion completa de docker-compose + eliminacion de comnetarios innecesarios + nuevo readme con configuracion de .env ([#8](https://github.com/PeyranoDev/GroceryManagment/issues/8)) ([ec3104c](https://github.com/PeyranoDev/GroceryManagment/commit/ec3104c3159eebbea4c888ccac57d20ebe0ea7c6)), closes [#9](https://github.com/PeyranoDev/GroceryManagment/issues/9) [#9](https://github.com/PeyranoDev/GroceryManagment/issues/9) [#11](https://github.com/PeyranoDev/GroceryManagment/issues/11) [#10](https://github.com/PeyranoDev/GroceryManagment/issues/10)
* dockerfile + docker-compose + start scripts for powershell and bash ([263be61](https://github.com/PeyranoDev/GroceryManagment/commit/263be6180b780142f8928926841641057264305a))
* **Frontend:** creacion con datos mock del frontend (Estructura basica) ([c08eaba](https://github.com/PeyranoDev/GroceryManagment/commit/c08eabaf8b413f697b2f5d88efd843fc3daa8886))
* nginx + postgre + migrate.sh ([30463ab](https://github.com/PeyranoDev/GroceryManagment/commit/30463ab72c6a9fd7f19c0c127efbecc0a5f51e6f))
* nueva migracion para only 1 grocery ([76dbec5](https://github.com/PeyranoDev/GroceryManagment/commit/76dbec58fa63efd77f9c5c6af03a68af1dd83e24))
* seed sin necesidad de tenant ([739980a](https://github.com/PeyranoDev/GroceryManagment/commit/739980ab71daae14ba38cdaa20ac1cf876eb9a99))
* Settear variable de entorno para Semantic Release ([da8b1a1](https://github.com/PeyranoDev/GroceryManagment/commit/da8b1a19a8c8a1af4f0f6548414dfa3af9829667))

### 🐛 Bug Fixes

* arreglar error de merge ([245d4db](https://github.com/PeyranoDev/GroceryManagment/commit/245d4db44597e7fe8d5a4fbb3210a26198969de4))
* arreglar error de modulos ([e067d87](https://github.com/PeyranoDev/GroceryManagment/commit/e067d877c0aff18ed2450c0d911b3b963cdf9a25))
* arreglar faltante de dependencias ([2bc5557](https://github.com/PeyranoDev/GroceryManagment/commit/2bc555751f5e221af441dfb5a8b124abce140ff1))
* fix de import mal escrito ([283bb9b](https://github.com/PeyranoDev/GroceryManagment/commit/283bb9b6547a29581184de9c0b3aa3a8246f42df))
* hacer funcionar el seed de grocery ([94b3c79](https://github.com/PeyranoDev/GroceryManagment/commit/94b3c79b9a378906dd4e98b729cb41895c323fe9))

### ♻️ Code Refactoring

* **frontend:** restructure components and update styles ([4efc2ab](https://github.com/PeyranoDev/GroceryManagment/commit/4efc2ab988638cf8e4e6d04e21cc2fdc5750ea3a))
* rehacer dto de login y dto de respuesta para tomar los datos solamente necesarios ([3d8a90c](https://github.com/PeyranoDev/GroceryManagment/commit/3d8a90c7f806cb42e905e2ceaed0a9c4ec4b093f))

### 💎 Styles

* **ui:** add transitions for smoother interactions ([#7](https://github.com/PeyranoDev/GroceryManagment/issues/7)) ([090117f](https://github.com/PeyranoDev/GroceryManagment/commit/090117f481fcf7d40ccb38bb19b16279788ad338))

### 🔧 CI/CD

* Implementacion de Semantic Release en CI/CD ([2090c90](https://github.com/PeyranoDev/GroceryManagment/commit/2090c90d679309403e2ad429ebdddf5133a1378f))

### 🔨 Chores

* **all:** tomar commits de front en main ([#18](https://github.com/PeyranoDev/GroceryManagment/issues/18)) ([65af607](https://github.com/PeyranoDev/GroceryManagment/commit/65af6077e813c27adee994ecc0ebf2b03385671c))
* Eliminar NGINX y Optimizacion de API URL ([32f48ac](https://github.com/PeyranoDev/GroceryManagment/commit/32f48acd74d345784e4223907dc4aaa65226e5ed))
* main backend files commit  ([62559f4](https://github.com/PeyranoDev/GroceryManagment/commit/62559f41bc7543c85f63e5331b6b35df3d7b6423)), closes [#4](https://github.com/PeyranoDev/GroceryManagment/issues/4)
* rehacer servicios y solucionar problema de tenant ([11a0495](https://github.com/PeyranoDev/GroceryManagment/commit/11a04951642865d5e9ffea7caeba7196e40c8eee))
* set up frontend structure ([72d3648](https://github.com/PeyranoDev/GroceryManagment/commit/72d364854da95cd2e573977d1daf88e8933198a0))
* set up readme.md ([7f57b83](https://github.com/PeyranoDev/GroceryManagment/commit/7f57b835d4519f8b44aad46cefa54faa0163ce55))
