document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById('songsChart').getContext('2d');
    const statTypeSelect = document.getElementById('statType');

    let chart;

    async function fetchHistoryData() {
        try {
            const response = await fetch('/api/history/historysongsartist');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Can not fetch history songs of the artist:', error);
            return [];
        }
    }

    function updateChart(statType, historyData) {
        if (chart) {
            chart.destroy();
        }

        const songs = historyData.map(item => item.name);
        const playingTimes = historyData.map(item => parseFloat(item.total_listening_times).toFixed(2));
        const likes = historyData.map(item => parseInt(item.total_likes));

        if (statType === 'likes_playing_time') {
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: songs,
                    datasets: [
                        {
                            label: 'Likes',
                            data: likes,
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Playing Times (Hours)',
                            data: playingTimes,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Values'
                            },
                            grid: {
                                color: '#696969'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Songs'
                            },
                            grid: {
                                color: '#696969'
                            }
                        }
                    },
                    plugins: {
                        datalabels: {
                            anchor: 'end',
                            align: 'end',
                            formatter: (value) => value,
                            color: '#000',
                            font: {
                                weight: 'bold',
                                size: 14
                            }
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });
        }
    }

    async function init() {
        const historyData = await fetchHistoryData();
        updateChart(statTypeSelect.value, historyData);
    }

    init();

    statTypeSelect.addEventListener('change', async function() {
        updateChart(this.value, historyData);
    });
});
