// Timezone configurations
const timezones = {
    'ny': { name: 'New York', offset: -5, code: 'EST/EDT' },
    'london': { name: 'London', offset: 0, code: 'GMT/BST' },
    'paris': { name: 'Paris', offset: 1, code: 'CET/CEST' },
    'dubai': { name: 'Dubai', offset: 4, code: 'GST' },
    'tokyo': { name: 'Tokyo', offset: 9, code: 'JST' },
    'sydney': { name: 'Sydney', offset: 10, code: 'AEST/AEDT' },
    'la': { name: 'Los Angeles', offset: -8, code: 'PST/PDT' },
    'singapore': { name: 'Singapore', offset: 8, code: 'SGT' },
    'india': { name: 'India', offset: 5.5, code: 'IST' }
};

let customTimezones = {};

// Format time with leading zero
function formatTime(num) {
    return String(num).padStart(2, '0');
}

// Get time for a specific timezone
function getTimeForTimezone(offset) {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const timeInTimezone = new Date(utc + 3600000 * offset);
    return timeInTimezone;
}

// Format date
function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Update clock display
function updateClock() {
    // Update main timezones
    Object.keys(timezones).forEach(key => {
        const tz = timezones[key];
        const time = getTimeForTimezone(tz.offset);
        
        const hours = formatTime(time.getHours());
        const minutes = formatTime(time.getMinutes());
        const seconds = formatTime(time.getSeconds());
        
        const timeId = key + '-time';
        const dateId = key + '-date';
        
        const timeElement = document.getElementById(timeId);
        const dateElement = document.getElementById(dateId);
        
        if (timeElement) {
            timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
        if (dateElement) {
            dateElement.textContent = formatDate(time);
        }
    });

    // Update custom timezones
    Object.keys(customTimezones).forEach(key => {
        const tz = customTimezones[key];
        const time = getTimeForTimezone(tz.offset);
        
        const hours = formatTime(time.getHours());
        const minutes = formatTime(time.getMinutes());
        const seconds = formatTime(time.getSeconds());
        
        const timeElement = document.getElementById('custom-time-' + key);
        const dateElement = document.getElementById('custom-date-' + key);
        
        if (timeElement) {
            timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
        if (dateElement) {
            dateElement.textContent = formatDate(time);
        }
    });

    // Update local time
    const now = new Date();
    const localHours = formatTime(now.getHours());
    const localMinutes = formatTime(now.getMinutes());
    const localSeconds = formatTime(now.getSeconds());
    
    document.getElementById('local-time').textContent = `${localHours}:${localMinutes}:${localSeconds}`;
    document.getElementById('local-date').textContent = formatDate(now);
    
    // Get local timezone info
    const timeZoneFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timeZoneName: 'short'
    });
    const parts = timeZoneFormatter.formatToParts(now);
    const tzNamePart = parts.find(part => part.type === 'timeZoneName');
    
    if (tzNamePart) {
        document.getElementById('local-timezone').textContent = `Your Timezone: ${tzNamePart.value}`;
    }
}

// Add custom timezone
function addCustomTimezone() {
    const nameInput = document.getElementById('timezone-name');
    const offsetInput = document.getElementById('timezone-offset-input');
    
    const name = nameInput.value.trim();
    const offset = parseFloat(offsetInput.value);
    
    if (!name || isNaN(offset)) {
        alert('Please enter a valid city name and UTC offset');
        return;
    }

    if (offset < -12 || offset > 14) {
        alert('UTC offset must be between -12 and 14');
        return;
    }

    const id = 'custom-' + Date.now();
    customTimezones[id] = { name: name, offset: offset };
    
    // Create card for custom timezone
    const customClocksContainer = document.getElementById('custom-clocks');
    const card = document.createElement('div');
    card.className = 'custom-clock-card';
    card.innerHTML = `
        <button class="close-btn" onclick="removeCustomTimezone('${id}')">×</button>
        <h4>${name}</h4>
        <div class="time-display" id="custom-time-${id}">00:00:00</div>
        <div class="date-display" id="custom-date-${id}">--</div>
        <div class="timezone-offset">UTC${offset >= 0 ? '+' : ''}${offset}</div>
    `;
    
    customClocksContainer.appendChild(card);
    
    // Clear inputs
    nameInput.value = '';
    offsetInput.value = '';
    
    // Update immediately
    updateClock();
}

// Remove custom timezone
function removeCustomTimezone(id) {
    delete customTimezones[id];
    const element = document.getElementById('custom-time-' + id).closest('.custom-clock-card');
    if (element) {
        element.remove();
    }
}

// Initialize clock
function initClock() {
    updateClock();
    // Update clock every second
    setInterval(updateClock, 1000);
}

// Start clock when page loads
document.addEventListener('DOMContentLoaded', initClock);