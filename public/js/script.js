$(document).ready(function() {
  const table = $('#employeeTable').DataTable({
    responsive: true,
    dom: '<"top"f>rt<"bottom"lip><"clear">',
    initComplete: function() {
      $('#search').on('keyup', function() {
        table.search(this.value).draw();
      });
      
      $('#statusFilter').on('change', function() {
        const val = $(this).val();
        if (val === '') {
          table.columns(4).search('').draw();
        } else {
          table.columns(4).search(val === 'active' ? '^Active$' : '^Inactive$', true, false).draw();
        }
      });
    }
  });
});