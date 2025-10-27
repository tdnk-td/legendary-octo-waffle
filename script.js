  const syndicateArcanes = {
    "The Quills": [
      "magus_cloud", "magus_replenish", "magus_nourish", "magus_cadence", "magus_elevate"
    ],
    "Cavia": [
      "melee_retaliation", "melee_fortification", "melee_exposure", "melee_influence", "melee_animosity", "melee_vortex"
    ],
    "The Holdfasts": [
      "eternal_eradicate", "eternal_onslaught", "cascadia_flare", "cascadia_empowered", "cascadia_overcharge",
      "molt_vigor", "molt_efficiency", "molt_augmented", "molt_reconstruct"
    ],
    "The Hex": [
      "primary_crux", "arcane_camisado", "arcane_impetus", "arcane_truculence",
      "arcane_bellicose", "secondary_enervate", "arcane_crepuscular"
    ],
    "Cephalon Simaris": [
      "energy_conversion", "health_conversion"
    ]
  };

  const proxy = 'https://corsproxy.io/?';
  const baseUrl = 'https://api.warframe.market/v1/items/';
  const fallbackImage = 'images/fallback.png';

  /**
   * Fetches the image URL for the given arcane.
   * Tries to fetch the image from the Warframe Market API, but returns a fallback image
   * if it fails or the image is unknown.
   * @param {string} arcane - The name of the arcane.
   * @returns {Promise<string>} The image URL.
   */
  async function fetchArcaneImage(arcane) {
    try {
      const res = await fetch(proxy + encodeURIComponent(`${baseUrl}${arcane}`));
      const data = await res.json();
      const item = data.payload.item.items_in_set[0];
      if (!item.icon || item.icon.includes('unknown.png')) {
        return fallbackImage;
      }
      return `https://warframe.market/static/assets/${item.icon}`;
    } catch {
      return fallbackImage;
    }
  }

  function capitalizeName(str) {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Fetches the price information for the given arcane.
   * Tries to fetch the top 4 rank 5 ingame sell orders from the Warframe Market API and
   * calculates the average price. If there are no such orders, returns null.
   * @param {string} arcane - The name of the arcane.
   * @returns {Promise<{name: string, prices: number[], avgPrice: number, image: string}>}
   * The price information for the arcane, or null if there is no data.
   */
  async function fetchArcaneInfo(arcane) {
    try {
      const res = await fetch(proxy + encodeURIComponent(`${baseUrl}${arcane}/orders`));
      const data = await res.json();
      const orders = data.payload.orders;

      const rank5Ingame = orders.filter(o =>
        o.order_type === 'sell' &&
        o.user.status === 'ingame' &&
        o.mod_rank === 5
      );

      if (rank5Ingame.length === 0) return null;
      const sorted = rank5Ingame.sort((a, b) => a.platinum - b.platinum);
      const top4 = sorted.slice(0, 4);
      const avg = top4.reduce((sum, o) => sum + o.platinum, 0) / top4.length;
      const image = await fetchArcaneImage(arcane);

      return {
        name: capitalizeName(arcane),
        prices: top4.map(o => o.platinum),
        avgPrice: Math.round(avg),
        image: image
      };
    } catch (e) {
      console.error(`Error fetching ${arcane}:`, e);
      return null;
    }
  }

  /**
   * Renders the prices for all arcanes in the syndicateArcanes object.
   * Fetches the price information for each arcane, and renders a list with the
   * prices sorted by highest price first. If there is no price information for
   * an arcane, it is not included in the list.
   * @returns {Promise<void>}
   */
  async function renderSyndicateData() {
    const output = document.getElementById('output');
    output.textContent = 'Loading prices...';

    const container = document.createElement('div');

    for (const [syndicate, arcanes] of Object.entries(syndicateArcanes)) {
      const group = document.createElement('div');
      group.className = 'syndicate-group';

      const title = document.createElement('h2');
      title.innerHTML = `${syndicate} <span class="collapse-arrow">▼</span>`;
      title.style.cursor = 'pointer';

      const list = document.createElement('div');
      list.className = 'arcane-list';

      title.onclick = () => {
        title.classList.toggle('collapsed');
        if (title.classList.contains('collapsed')) {
          list.style.maxHeight = '0';
          list.style.opacity = '0';
        } else {
          list.style.maxHeight = list.scrollHeight + 'px';
          list.style.opacity = '1';
        }
      };

      const arcaneInfos = await Promise.all(arcanes.map(a => fetchArcaneInfo(a)));
      const filtered = arcaneInfos.filter(Boolean);
      const maxPrice = Math.max(...filtered.map(a => a.prices[0]));

      filtered.sort((a, b) => b.prices[0] - a.prices[0]).forEach(info => {
        const card = document.createElement('div');
        card.className = 'arcane-card';

        const priceClass =
          info.prices[0] === maxPrice ? 'price-high' :
          info.prices[0] >= maxPrice * 0.75 ? 'price-mid' :
          'price-low';

        const pricesHTML = info.prices.map(p => `${p}p`).join(', ');

        card.innerHTML = `
          <img src="${info.image}" alt="${info.name}">
          <div><strong>${info.name}</strong></div>
          <div class="price ${priceClass}">Prices: ${pricesHTML}</div>
          <div class="avg-price">Avg: ${info.avgPrice}p</div>
        `;

        list.appendChild(card);
      });

      group.appendChild(title);
      group.appendChild(list);
      container.appendChild(group);
    }

    output.innerHTML = '';
    output.appendChild(container);
  }

  renderSyndicateData();
  // setInterval(renderSyndicateData, 300000); // update every 5 minutes
