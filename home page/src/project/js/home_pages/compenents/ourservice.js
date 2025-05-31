const stats = [
  {
    imagePath: "../../../images/home/delivery.png",
    value: "Delivery & Repair",
    label:
      "We offer a delivery service to pick up and return your device after repair. No need to travel— we take care of transportation safely and efficiently.",
  },
  {
    imagePath: "../../../images/home/star.png",
    value: "Repairer rating",
    label:
      "Each repair technician receives a rating based on customer reviews. A ranking system ensures the highest quality of service for consumers.",
  },
]

const statsContainer = document.getElementById("stats-container")
stats.forEach((stat) => {
  const div = document.createElement("div")
  div.className = "flex flex-col md:flex-row items-start gap-3 mb-4 md:mb-0 flex-1"
  div.innerHTML = `
    <div class="bg-gray-800 p-3 rounded-lg mr-2 text-white self-start">
      <img src="${stat.imagePath}" alt="Stat icon" class="w-8 h-8 filter brightness-0 invert">
    </div>
    <div class="flex-1">
      <p class="text-lg font-bold mb-1">${stat.value}</p>
      <p class="text-gray-700 text-xs leading-relaxed max-w-md">${stat.label}</p>
    </div>
  `
  statsContainer.appendChild(div)
})

