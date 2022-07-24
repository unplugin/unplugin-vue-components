<script lang="ts">
import { ref } from 'vue'
// from PrimeVue
// import '@fullcalendar/core'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from '@fullcalendar/interaction'

// from FullCalendar
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  components: {
    FullCalendar,
  },
  setup() {
    const options = ref({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialDate: '2017-02-01',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
    })

    return { options }
  },
}
</script>

<template>
  <h3>Component PrimveVue:</h3>
  <div class="flex">
    <div>The button:</div>
    <Button label="PrimeVue Button" icon="pi pi-cog" />
  </div>
  <div class="full-calendar mt-3">
    <FullCalendar :options="options" />
  </div>
</template>
