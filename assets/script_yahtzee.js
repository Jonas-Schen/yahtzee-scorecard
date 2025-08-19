$(document).ready(function() {
    const $tabList = $('#tab-list');
    const $tabContents = $('#tab-contents');
    const $addTabBtn = $('#add-tab-btn');
    let tabIndexController = 0;

    loadScores();

    function buildTables(tabId) {
        const rowNames = ['1', '2', '3', '4', '5', '6', 'T1', 'B', 'T2', '3K', '4K', 'FH', 'SS', 'LS', 'SC', 'LC', 'Y', 'T3', 'T4', 'FS'];

        const tbody = $(`#score-table-${tabId} tbody`);
        rowNames.forEach(name => {
            if (name === 'FS') {
                tbody.append(`
                    <tr>
                        <td>${name}</td>
                        <td colspan="4"><span class="player-score" data-column="fs" data-row="${name}"></td>
                    </tr>
                `);
            } else {
                const rowClass = ['6', 'T2', 'Y', 'T4'].includes(name) ? 'thick-border-bottom' : '';
                tbody.append(`
                    <tr class="${rowClass}">
                        <td>${name}</td>
                        <td><span class="player-score" data-column="down" data-row="${name}"></td>
                        <td><span class="player-score" data-column="up" data-row="${name}"></td>
                        <td><span class="player-score" data-column="m" data-row="${name}"></td>
                        <td><span class="player-score" data-column="f" data-row="${name}"></td>
                    </tr>
                `);
            }
        });

        // Disables inputs from prohibited lines
        $('.player-score[data-row="T1"], .player-score[data-row="B"], .player-score[data-row="T2"], .player-score[data-row="T3"], .player-score[data-row="T4"], .player-score[data-row="FS"]').addClass('inactive-input').attr('readonly', true);
    }

    // Prevents the modal from being opened for prohibited lines
    $(document).on('click', '.inactive-input', function(event) {
        event.stopPropagation(); // Prevents the click event from propagating to prevent the modal from opening
    });

    $(document).on('dblclick', '.div-player-name>span', function(event) {
        let currentName = $(this).html().trim();
        $('#modal-player-name').modal('show');
        $('#modal-player-name').data('player-id', $(this).closest('.div-player-name').attr('id'));
        $("#player-name").val(currentName);
        $('#player-name').select();
    });

    $('.confirm-player-name').click(function() {
        const playerId = $('#modal-player-name').data('player-id');
        $(`#${playerId}>span`).html($('#player-name').val().toUpperCase());
        $('#modal-player-name').modal('hide');
        $('#modal-player-name').data('player-id', '');
        savePlayerName();
    });

    $('#player-name').on('keypress',function(e) {
        if(e.which == 13) {
            $('.confirm-player-name').click();
        }
    });

    function savePlayerName() {
        const playerName = $(".div-player-name>span").html().trim()
        localStorage.setItem('yahtzee-scores-player-name', playerName);
    }

    function loadScores() {
        const scores = JSON.parse(localStorage.getItem('yahtzee-scores'));
        if (scores == null || scores.length === 0) {
            addTab('Player 1');
            buildTables(1);

            return;
        }

        for (let i = 0; i < scores.length; i++) {
            addTab(scores[i].playerName);
        }

        // Selects the first tab
        switchTab($("#tab-list li").eq(0));

        if (scores) {
            let tabIndex = 0;
            $('#tab-contents .tab-content').each(function() {
                $(this).find('.player-score').each(function() {
                    const row = $(this).data('row');
                    const column = $(this).data('column');

                    let value = scores[tabIndex].playerScore[row][column];

                    if (scores[tabIndex].playerScore[row] && value) {
                        $(this).html(scores[tabIndex].playerScore[row][column]);
                        if (value === '-') {
                            $(this).addClass('crossed');
                        }
                    }
                });
                tabIndex++;
            });
        }
    }

    /****************************************************************************/
    /******************************** MANAGE TABS *******************************/
    /****************************************************************************/
    // Function to switch between tabs
    function switchTab($tab) {
        const targetTab = $tab.data('tab');

        // Remove the active class from all tabs and contents
        $('.tab, .tab-content').removeClass('active');

        // Add the active class to the clicked tab and content
        $tab.addClass('active');
        $('#' + targetTab).addClass('active');
    }

    // Function to add a new tab
    function addTab(playerName = '') {
        let tabCount = $("#tab-list li").length;
        if (tabCount >= 3) {
            alert('Maximum of 3 players allowed.');
            return;
        }

        if (playerName === '') {
            playerName = prompt('Enter player name:');
        }

        if (playerName.trim() === '') {
            return;
        }

        tabIndexController++;
        const newTabId = `tab-${tabIndexController}`;

        // Create the new tab
        const $newTab = $(`
            <li class="tab" data-tab="${newTabId}">
                <div class="close-tab"><button class="close-tab-btn" onclick="removeTab('${newTabId}')">X</button></div>
                <div id="player-name-${tabIndexController+1}" class="div-player-name">
                    <span>
                        ${playerName.toUpperCase()}
                    </span>
                </div>
            </li>
        `);
        $tabList.append($newTab);

        // Create the new tab content
        const $newTabContent = $(`
            <div id="${newTabId}" class="tab-content">
                <div class="table-responsive">
                    <table id="score-table-${tabIndexController}" class="table score-table table-bordered">
                        <thead>
                            <tr class="thick-border-bottom">
                                <th style="width: 10%;">&nbsp;</th>
                                <th style="width: 22.5%;">↓</th>
                                <th style="width: 22.5%;">↑</th>
                                <th style="width: 22.5%;">M</th>
                                <th style="width: 22.5%;">F</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        `);
        $tabContents.append($newTabContent);
        switchTab($newTab);
        buildTables(tabIndexController);

        if (tabCount >= 2) {
            $('#add-tab-btn').hide();
        }
    }

    // Function to remove a tab
    window.removeTab = function(tabId) {
        const $tab = $(`.tab[data-tab="${tabId}"]`);
        const $content = $(`#${tabId}`);

        let playerName = $tab.find('.div-player-name>span').html().trim();
        if (!confirm(`Are you sure you want to delete the player ${playerName}?`)) {
            return;
        }

        // Remove the tab and content
        $tab.remove();
        $content.remove();

        let tabCount = $("#tab-list li").length;
        if (tabCount < 3) {
            $('#add-tab-btn').show();
        }

        // If the removed tab was active, activate the first tab
        if ($tab.hasClass('active')) {
            const $firstTab = $tabList.find('.tab').first();
            if ($firstTab.length) {
                switchTab($firstTab);
            }
        }
    };

    // Adds click event to tabs
    $tabList.on('click', '.tab', function() {
        switchTab($(this));
    });

    // Adds click event to add tab button
    $addTabBtn.on('click', function() {
        addTab();
    });
});
