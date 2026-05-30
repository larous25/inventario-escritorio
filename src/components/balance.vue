<template>
  <div class="container-fluid py-3 px-2 px-md-4">

    <!-- Breadcrumb -->
    <nav
      aria-label="breadcrumb"
      class="mb-4"
    >

      <ol class="breadcrumb">

        <li class="breadcrumb-item">
          <router-link to="/products">
            Inicio
          </router-link>
        </li>

        <li class="breadcrumb-item active">
          Balance
        </li>

      </ol>

    </nav>

    <!-- CONTENT -->
    <div
      class="card shadow-sm border-0 rounded-4"
    >

      <div
        class="card-body
               d-flex
               flex-column
               align-items-center
               justify-content-center
               text-center
               py-5"
      >

        <!-- ICON -->
        <div class="empty-icon mb-4">
          📊
        </div>

        <!-- TITLE -->
        <h2 class="fw-bold mb-3">
          No hay datos disponibles
        </h2>

        <!-- DESCRIPTION -->
        <p
          class="text-muted mb-4"
          style="max-width: 500px;"
        >
          Todavía no existen registros suficientes
          para generar un balance o estadísticas.
        </p>

        <!-- BUTTON -->
        <button
          @click="back"
          class="btn btn-primary px-4"
        >
          Volver al inicio
        </button>

      </div>

    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function back() {

  router.push({
    name: 'products'
  })
}
</script>

<style scoped>
.empty-icon {
  font-size: 5rem;
  line-height: 1;
}

.card {
  min-height: 65vh;
}

.btn {
  border-radius: 12px;
}

@media (max-width: 768px) {

  .empty-icon {
    font-size: 4rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .card {
    min-height: 55vh;
  }
}
</style>