// Export guest list to CSV
export function exportGuestListCSV(guests, partyName) {
  const headers = ['Name', 'Email', 'Phone', 'RSVP Status', 'Plus Ones', 'Dietary Restrictions', 'Notes'];

  const csvRows = [
    headers.join(','),
    ...guests.map(guest => [
      `"${guest.name || ''}"`,
      `"${guest.email || ''}"`,
      `"${guest.phone || ''}"`,
      `"${guest.status || 'pending'}"`,
      guest.plusOnes || 0,
      `"${guest.dietary || ''}"`,
      `"${guest.notes || ''}"`,
    ].join(','))
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${partyName || 'party'}_guest_list.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export budget to CSV
export function exportBudgetCSV(budgetItems, partyName) {
  const headers = ['Category', 'Item', 'Estimated Cost', 'Actual Cost', 'Status', 'Notes'];

  const csvRows = [
    headers.join(','),
    ...budgetItems.map(item => [
      `"${item.category || ''}"`,
      `"${item.name || ''}"`,
      item.estimatedCost || 0,
      item.actualCost || 0,
      `"${item.status || 'pending'}"`,
      `"${item.notes || ''}"`,
    ].join(','))
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${partyName || 'party'}_budget.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export checklist to CSV
export function exportChecklistCSV(checklist, partyName) {
  const headers = ['Task', 'Category', 'Priority', 'Status', 'Due Date', 'Estimated Cost', 'Notes'];

  const csvRows = [
    headers.join(','),
    ...checklist.map(item => [
      `"${item.task || ''}"`,
      `"${item.category || ''}"`,
      `"${item.priority || ''}"`,
      item.completed ? 'Completed' : 'Pending',
      `"${item.dueDate || ''}"`,
      `"${item.estimatedCost || ''}"`,
      `"${item.notes || ''}"`,
    ].join(','))
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${partyName || 'party'}_checklist.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
