export function setupCustomSelects() {
    const customSelects = document.querySelectorAll('.custom-select');

    customSelects.forEach(customSelect => {
        const selectEl = customSelect.querySelector('select');
        if (!selectEl) return;
 
        const oldDiv = customSelect.querySelector('.select-selected');
        if (oldDiv) {
            oldDiv.remove();
            const oldItems = customSelect.querySelector('.select-items');
            if (oldItems) oldItems.remove();
        }

        const selectedDiv = document.createElement('div');
        selectedDiv.className = 'select-selected';
        selectedDiv.innerHTML = selectEl.options[selectEl.selectedIndex].innerHTML;
        customSelect.appendChild(selectedDiv);

        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'select-items select-hide';
        
        const searchBox = document.createElement('div');
        searchBox.className = 'select-search-box';
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Pesquisar...';
        
        searchInput.addEventListener('input', function() {
            const filter = searchInput.value.toLowerCase();
            const options = itemsDiv.querySelectorAll('.select-option');
            options.forEach(opt => {
                const text = opt.textContent.toLowerCase();
                opt.style.display = text.includes(filter) ? 'block' : 'none';
            });
        });

        searchBox.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        searchBox.appendChild(searchInput);
        itemsDiv.appendChild(searchBox);

        for (let i = 0; i < selectEl.length; i++) {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'select-option';
            optionDiv.innerHTML = selectEl.options[i].innerHTML;
            
            optionDiv.addEventListener('click', function(e) {
                selectEl.selectedIndex = i;
                selectedDiv.innerHTML = this.innerHTML;
                
                const sameAsSelected = this.parentNode.querySelectorAll('.same-as-selected');
                sameAsSelected.forEach(el => el.classList.remove('same-as-selected'));
                this.classList.add('same-as-selected');
                
                selectedDiv.click();
                
                const event = new Event('change');
                selectEl.dispatchEvent(event);
            });
            itemsDiv.appendChild(optionDiv);
        }
        customSelect.appendChild(itemsDiv);

        selectedDiv.addEventListener('click', function(e) {
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle('select-hide');
            this.classList.toggle('select-arrow-active');
            
            if (!this.nextSibling.classList.contains('select-hide')) {
                searchInput.value = '';
                const options = itemsDiv.querySelectorAll('.select-option');
                options.forEach(opt => opt.style.display = 'block');
                searchInput.focus();
            }
        });
    });

    document.addEventListener('click', closeAllSelect);
}

function closeAllSelect(elmnt) {
    const items = document.querySelectorAll('.select-items');
    const selected = document.querySelectorAll('.select-selected');
    const arrNo = [];
    selected.forEach((sel, idx) => {
        if (elmnt === sel) {
            arrNo.push(idx);
        } else {
            sel.classList.remove('select-arrow-active');
        }
    });
    items.forEach((item, idx) => {
        if (!arrNo.includes(idx)) {
            item.classList.add('select-hide');
        }
    });
}
