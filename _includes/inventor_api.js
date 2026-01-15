window.inventor_events = window.inventor_events || [];
window.inventor_events.push('{{ site.app_name }}');
window.inventor_events.push('{{ page.name | split: "." | first }}');


(async function () {
    // --- Helper Functions ---
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // --- Asynchronous Data Collection ---
    async function getBrowserInfo() {
        const browserInfo = {
            // Basic Info
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages,
            userAgent: navigator.userAgent,
            vendor: navigator.vendor,

            // Screen
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            colorDepth: window.screen.colorDepth,
            pixelRatio: window.devicePixelRatio,

            // Window
            windowInnerWidth: window.innerWidth,
            windowInnerHeight: window.innerHeight,

            // Location
            referrer: document.referrer,
            pageUrl: window.location.href,

            // Time
            timezoneOffset: new Date().getTimezoneOffset(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

            // Connection (where available)
            connection: {
                effectiveType: navigator.connection?.effectiveType,
                downlink: navigator.connection?.downlink,
                rtt: navigator.connection?.rtt,
                saveData: navigator.connection?.saveData,
            },

            // Device Capabilities (where available)
            deviceMemory: navigator.deviceMemory,
            hardwareConcurrency: navigator.hardwareConcurrency,
        };

        // User-Agent Client Hints (the modern approach)
        if (navigator.userAgentData) {
            browserInfo.userAgentData = {
                brands: navigator.userAgentData.brands,
                mobile: navigator.userAgentData.mobile,
                platform: navigator.userAgentData.platform,
            };
            try {
                const highEntropyValues = await navigator.userAgentData.getHighEntropyValues([
                    "architecture", "model", "platformVersion", "uaFullVersion", "bitness"
                ]);
                Object.assign(browserInfo.userAgentData, highEntropyValues);
            } catch (error) {
                // console.warn('Could not retrieve high-entropy client hints:', error);
            }
        }

        return browserInfo;
    }

    // --- Main Execution ---
    try {
        const visitorId = getCookie('inventor_vid');
        const browserInfo = await getBrowserInfo();

        // Check for custom events pushed to the window object
        const events = window.inventor_events || [];

        // console.log('Inventor Events being sent:', events);

        const dataToSend = {
            visitor_id: visitorId, // Will be null on first visit
            referrer: document.referrer, // Add referrer to the top-level payload
            browser_info: browserInfo,
            events: events, // Send any collected events
        };

        // const apiUrl = 'https://dev.1voct.org/inventor/api/track_visit/';
        const apiUrl = 'https://inventor.1voct.org/inventor/api/track_visit/';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
        });

        const result = await response.json();
        // console.log('Tracking API Response:', result);
        const statusEl = document.getElementById('status');
        if (statusEl) {
            // statusEl.className = 'alert alert-success';
            // statusEl.textContent = 'Visit successfully tracked! Check the console for details.';
        }
    } catch (error) {
        // console.error('Tracking API Error:', error);
        const statusEl = document.getElementById('status');
        if (statusEl) {
            // statusEl.className = 'alert alert-danger';
            // statusEl.textContent = 'An error occurred while tracking the visit.';
        }
    }

    // --- Subscription Form Logic (conditionally executed) ---
    const subscribeForms = document.querySelectorAll('form[data-form="subscribe"]');
    if (subscribeForms.length > 0) {
        subscribeForms.forEach(form => {
            form.addEventListener('submit', function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            data.visitor_id = getCookie('inventor_vid');

            // Find the hidden tags input within this specific form
            const tagsInput = form.querySelector('input[name="tags"]');
            if (tagsInput && tagsInput.value) {
                data.tags = tagsInput.value.split(',').map(tag => tag.trim());
            } else {
                delete data.tags;
            }

            // Find the response message div related to this form
            const responseDiv = form.nextElementSibling;
            if (!responseDiv || !responseDiv.classList.contains('response-message')) {
                console.error('Could not find a .response-message element for the form.');
                return;
            }

            const baseUrl = 'https://inventor.1voct.org';
            // const baseUrl = 'https://dev.1voct.org';
            const apiUrl = `${baseUrl}/inventor/api/create_crm_user/`;

            fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                responseDiv.className = 'response-message mt-3'; // Reset classes
                if (result.status === 'success') {
                    responseDiv.classList.add('text-green-400');
                    responseDiv.textContent = result.message || 'Subscription successful!';
                    form.reset();
                } else {
                    responseDiv.classList.add('text-red-400');
                    responseDiv.textContent = 'Error: ' + (result.message || 'An unknown error occurred.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                responseDiv.className = 'response-message mt-3 text-red-400';
                responseDiv.textContent = 'A network error occurred. Please try again.';
            });
        });
        });
    }
})();