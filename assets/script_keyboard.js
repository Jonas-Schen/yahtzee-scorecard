$(document).ready(function() {
    let activeInput;

    // Variável para armazenar o valor atual do teclado
    let keyboardValue = '0';

    function updateKeyboardScreen() {
        updateModalTitle();
        $('#keyboardScreen').text(keyboardValue);
    }

    function updateModalTitle() {
        const columnName = getColumnName();
        let cellName = '';
        switch (activeInput.data('row').toString()) {
            case '1':
                cellName = 'ONES';
                break;
            case '2':
                cellName = 'TWOS';
                break;
            case '3':
                cellName = 'THREES';
                break;
            case '4':
                cellName = 'FOURS';
                break;
            case '5':
                cellName = 'FIVES';
                break;
            case '6':
                cellName = 'SIXES';
                break;
            case '3K':
                cellName = 'THREE OF A KIND';
                break;
            case '4K':
                cellName = 'FOUR OF A KIND';
                break;
            case 'FH':
                cellName = 'FULL HOUSE';
                break;
            case 'SS':
                cellName = 'SMALL STRAIGHT';
                break;
            case 'LS':
                cellName = 'LARGE STRAIGHT';
                break;
            case 'SC':
                cellName = 'SMALL CHANCE';
                break;
            case 'LC':
                cellName = 'LARGE CHANCE';
                break;
            case 'Y':
                cellName = 'YAHTZEE';
                break;
        }

        const title = cellName + ' ' + columnName;

        $('.modal-title').text(title);
    }

    function getColumnName() {
        switch (activeInput.data('column')) {
            case 'down':
                return 'ON DOWN';
            case 'up':
                return 'ON UP';
            case 'm':
                return 'IN THE MESS';
            case 'f':
                return 'ON FIRST TRY';
        }

        return '';
    }

    function addDigit(digit) {
        if (keyboardValue === '0') {
            keyboardValue = digit;
        } else {
            keyboardValue += digit;
        }
        updateKeyboardScreen();
    }

    function resetKeyboard() {
        keyboardValue = '0';
        updateKeyboardScreen();
    }

    function clearKeyboard() {
        keyboardValue = '';
        updateKeyboardScreen();
    }

    $('.reset').click(function() {
        if (confirm('Are you sure you want to restart the score?')) {
            $('.player-score').html('');
            $('.player-score.inactive-input').html('0');
            localStorage.removeItem('yahtzee-scores');
        }
    });

    // Function to handle clicking on keyboard buttons
    $('.key').click(function() {
        $(".keyboard-error").hide();

        const key = $(this).text();
        if (key === 'OK') {
            if (!validateRules()) {
                $(".keyboard-error").show();
                return false;
            }

            // When pressing Enter, insert the value from the keyboard into the clicked input only and close the modal
            activeInput.html(keyboardValue);
            activeInput.removeClass('active-input');
            activeInput.removeClass('crossed');
            $('#modal-keyboard').modal('hide');
            updateTotalScore();
        } else if (key === 'C') {
            // Pressing C clears the display
            clearKeyboard();
        } else if (key === 'X') {
            // Pressing X crosses out the punctuation
            activeInput.html('-');
            activeInput.addClass('crossed');
            activeInput.removeClass('active-input');
            $('#modal-keyboard').modal('hide');
            updateTotalScore();
        } else {
            // Add the digit to the display
            addDigit(key);
        }
    });

    function validateRules() {
        if (keyboardValue === '') {
            return true;
        }

        switch (activeInput.data('row').toString()) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
                return validateRuleNumber();
            case '3K':
                return validateRuleThreeOfAKind();
            case '4K':
                return validateRuleFourOfAKind();
            case 'FH':
                return validateRuleFullHouse();
            case 'SS':
                return validateRuleSmallStraight();
            case 'LS':
                return validateRuleLargeStraight();
            case 'SC':
                return validateRuleSmallChance();
            case 'LC':
                return validateRuleLargeChance();
            case 'Y':
                return validateRuleYahtzee();
        }

        return false;
    }

    function validateRuleNumber() {
        const rowNumber = activeInput.data('row');
        const max = rowNumber * 5;

        return (
            parseInt(keyboardValue) % rowNumber === 0 &&
            parseInt(keyboardValue) <= max &&
            parseInt(keyboardValue) >= rowNumber
        ) ||
        (parseInt(keyboardValue) === 0);
    }

    function validateRuleThreeOfAKind() {
        const allowedValues = ['23', '26', '29', '32', '35', '38'];

        return allowedValues.includes(keyboardValue);
    }

    function validateRuleFourOfAKind() {
        const allowedValues = ['44', '48', '52', '56', '60', '64'];

        return allowedValues.includes(keyboardValue);
    }

    function validateRuleFullHouse() {
        const allowedValues = ['37', '38', '39', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '56', '57', '58'];

        return allowedValues.includes(keyboardValue);
    }

    function validateRuleSmallStraight() {
        const allowedValues = ['50'];

        return allowedValues.includes(keyboardValue);
    }

    function validateRuleLargeStraight() {
        const allowedValues = ['60'];

        return allowedValues.includes(keyboardValue);
    }

    function validateRuleSmallChance() {
        const min = 5;
        let max = 30;
        const belowInput = getBelowInput(activeInput);
        const belowValue = belowInput.html();
        if (belowValue) {
            max = parseInt(belowValue) - 1;
        }

        return (
            parseInt(keyboardValue) >= min &&
            parseInt(keyboardValue) <= max
        ) ||
        (parseInt(keyboardValue) === 0);
    }

    function validateRuleLargeChance() {
        let min = 5;
        const max = 30;
        const aboveInput = getAboveInput(activeInput);
        const aboveValue = aboveInput.html();
        if (aboveValue) {
            min = parseInt(aboveValue) + 1;
        }

        return (
            parseInt(keyboardValue) >= min &&
            parseInt(keyboardValue) <= max
        ) ||
        (parseInt(keyboardValue) === 0);
    }

    function validateRuleYahtzee() {
        const allowedValues = ['85', '90', '95', '100', '105', '110'];

        return allowedValues.includes(keyboardValue);
    }

    function allowEdit(cell) {
        if (cell.data('column') === 'down') {
            const rowIndex = cell.closest('tr').index();
            if (rowIndex === 0) {
                return true;
            }
            const aboveInput = getAboveInput(cell);

            if (aboveInput.html()) { // Checks if the cell above is empty
                return true;
            }
        } else if (cell.data('column') === 'up') {
            if (cell.closest('tr').index() === 16) {
                return true;
            }
            const belowInput = getBelowInput(cell);
            if (belowInput.html()) { // Checks if the cell below is empty
                return true;
            }
        } else if (cell.data('column') === 'm' || cell.data('column') === 'f') {
            return true;
        }

        return false;
    }

    // Function to get the input above the current input
    function getAboveInput(currentInput) {
        const rowIndex = currentInput.closest('tr').index();
        const columnIndex = currentInput.closest('td').index();
        let aboveRow = null;
        if (rowIndex === 9) {
            aboveRow = currentInput.closest('tbody').find('tr').eq(rowIndex - 4);
        } else {
            aboveRow = currentInput.closest('tbody').find('tr').eq(rowIndex - 1);
        }

        return aboveRow.find('td').eq(columnIndex).find('.player-score');
    }

    function getBelowInput(currentInput) {
        const rowIndex = currentInput.closest('tr').index();
        const columnIndex = currentInput.closest('td').index();
        let belowRow = null;
        if (rowIndex === 5) {
            belowRow = currentInput.closest('tbody').find('tr').eq(rowIndex + 4);
        } else {
            belowRow = currentInput.closest('tbody').find('tr').eq(rowIndex + 1);
        }

        return belowRow.find('td').eq(columnIndex).find('.player-score');
    }

    // When user clicks close button, close the modal
    $('.close').click(function() {
        $('#modal-keyboard').modal('hide');
        $('#modal-player-name').modal('hide');
    });

    // Function to open the modal when clicking on a text input
    $(document).on('click', '.player-score', function() {
        openModal($(this));
    });

    function openModal(cell) {
        if (!allowOpen(cell)) {
            return;
        }

        $(".keyboard-error").hide();
        activeInput = cell; // Stores the clicked input
        activeInput.addClass('active-input'); // Adds a temporary class to the input

        $('#modal-keyboard').modal('show');
        keyboardValue = getDefaultValue();

        updateKeyboardScreen();
    }

    function allowOpen(cell) {
        if (cell.hasClass('inactive-input')) {
            return false;
        }

        if (!allowEdit(cell)) {
            return false;
        }

        return true;
    }

    function getDefaultValue() {
        if (activeInput.data('row') === 'SS') {
            return '50';
        }

        if (activeInput.data('row') === 'LS') {
            return '60';
        }

        return activeInput.html();
    }

    // Function to update the total score
    function updateTotalScore() {
        const activeTab = $('#tab-contents>.tab-content.active');
        // Loop through the columns
        activeTab.find('.player-score').each(function() {
            const currentInput = $(this);
            const columnIndex = currentInput.closest('td').index();

            // Ignore the first column (header)
            if (columnIndex !== 0) {
                let totalT1 = 0;
                let totalT2 = 0;
                let totalT3 = 0;
                let totalT4 = 0;
                let isFilled1 = false;
                let isFilled2 = false;
                let isFilled3 = false;
                let isFilled4 = false;
                let isFilled5 = false;
                let isFilled6 = false;

                // Loop through the cells in the current column
                currentInput.closest('tbody').find('tr').each(function() {
                    const cell = $(this).find('td').eq(columnIndex).find('.player-score');
                    paintCell(cell);
                    const rowIndex = cell.data('row');
                    if (rowIndex >= 1 && rowIndex <= 6) {
                        const value = parseInt(cell.html()) || 0;
                        totalT1 += value;

                        switch (rowIndex) {
                            case 1:
                                if (cell.html() != '') {
                                    isFilled1 = true;
                                }
                                break;
                            case 2:
                                if (cell.html() != '') {
                                    isFilled2 = true;
                                }
                                break;
                            case 3:
                                if (cell.html() != '') {
                                    isFilled3 = true;
                                }
                                break;
                            case 4:
                                if (cell.html() != '') {
                                    isFilled4 = true;
                                }
                                break;
                            case 5:
                                if (cell.html() != '') {
                                    isFilled5 = true;
                                }
                                break;
                            case 6:
                                if (cell.html() != '') {
                                    isFilled6 = true;
                                }
                                break;
                                                                    }
                    } else if (rowIndex === 'T1') { // Updates cell T1 with the total
                        cell.html(totalT1);
                    } else if (rowIndex === 'B') {
                        // Updates cell B according to the specified rule
                        const bCell = $('.player-score[data-row="B"]');
                        cell.removeClass('crossed');

                        if (totalT1 >= 60) {
                            cell.html(30);
                            totalT2 = totalT1 + 30;
                        } else {
                            if (isFilled1 && isFilled2 && isFilled3 && isFilled4 && isFilled5 && isFilled6) {
                                cell.html('-');
                                cell.addClass('crossed');
                            } else {
                                cell.html('');
                            }
                            totalT2 = totalT1;

                        }
                    } else if (rowIndex === 'T2') {
                        cell.html(totalT2);
                    } else {
                        if ((rowIndex === 'T3')) {
                            cell.html(totalT3);
                        } else if ((rowIndex === 'T4')) {
                            totalT4 = totalT2 + totalT3;
                            cell.html(totalT4);
                        } else {
                            const value = parseInt(cell.html()) || 0;
                            totalT3 += value;
                        }
                    }
                });
            }
        });

        let totalGeral = 0;
        activeTab.find(".score-table td span[data-row='T4']").each(function() {
            totalGeral += parseInt($(this).html()) || 0;
        });

        activeTab.find(".score-table td span[data-row='FS']").html(totalGeral);
        saveScores();
    }

    function saveScores() {
        const scores = [];
        let tabIndex = 0;

        $('#tab-contents .tab-content').each(function() {
            playerId = tabIndex;
            playerName = $("#tab-list li").eq(tabIndex).find('.div-player-name>span').html().trim();
            let playerScores = {};
            $(this).find('.player-score').each(function() {
                const row = $(this).data('row');
                const column = $(this).data('column');
                const value = $(this).html();

                if (!playerScores[row]) {
                    playerScores[row] = {};
                }
                playerScores[row][column] = value;
            });
            scores.push({
                playerName: playerName,
                playerScore: playerScores,
            });
            tabIndex++;
        });

        localStorage.setItem('yahtzee-scores', JSON.stringify(scores));
    }

    function paintCell(cell) {
        let row = (cell.data('row') || '').toString();
        let value = parseInt(cell.html());
        cell.removeClass('red');

        switch (row) {
            case '1':
                if (value < 2) {
                    cell.addClass('red');
                }
                break;
            case '2':
                if (value < 4) {
                    cell.addClass('red');
                }
                break;
            case '3':
                if (value < 9) {
                    cell.addClass('red');
                }
                break;
            case '4':
                if (value < 12) {
                    cell.addClass('red');
                }
                break;
            case '5':
                if (value < 15) {
                    cell.addClass('red');
                }
                break;
            case '6':
                if (value < 18) {
                    cell.addClass('red');
                }
                break;
            case 'T1':
                if (value < 60) {
                    cell.addClass('red');
                }
                break;
        }
    }

    updateTotalScore();
});
