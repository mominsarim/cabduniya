// Preview helper: append ?mobilePreview=1 to the URL to force mobile layout for quick checks
try {
    if (window.location.search && window.location.search.indexOf('mobilePreview=1') !== -1) {
        document.documentElement.classList.add('force-mobile');
        document.body.classList.add('force-mobile');
    }
} catch (e) { /* ignore in static preview */ }

$(function () {
    // Mobile menu custom toggle (Vanilla JS for robustness)
    const menuToggleBtn = document.getElementById('mobileMenuToggleBtn');
    const dropdownMenu = document.getElementById('mobileDropdownMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');

    if (menuToggleBtn && dropdownMenu && backdrop) {
        menuToggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            menuToggleBtn.classList.toggle('active');
            dropdownMenu.classList.toggle('show');
            backdrop.classList.toggle('show');
            document.body.classList.toggle('mobile-menu-open');
        });

        backdrop.addEventListener('click', function () {
            menuToggleBtn.classList.remove('active');
            dropdownMenu.classList.remove('show');
            backdrop.classList.remove('show');
            document.body.classList.remove('mobile-menu-open');
        });
    }

    function showEnquiryMessage(message, isError) {
        const $msg = $('#pMsg');
        if (!$msg.length) return;
        $msg
            .stop(true, true)
            .removeClass('text-danger text-success')
            .addClass(isError ? 'text-danger' : 'text-success')
            .text(message)
            .fadeIn(150);

        clearTimeout(window.__enquiryMsgTimer);
        window.__enquiryMsgTimer = setTimeout(function () {
            $msg.fadeOut(200);
        }, 3500);
    }

    function isValidEmail(email) {
        return email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidMobile(mobile) {
        return /^[0-9]{10}$/.test(mobile);
    }

    function validateEnquiry(prefix) {
        const name = $("#txtName" + prefix).val().trim();
        const email = $("#txtEmail" + prefix).val().trim();
        const mobile = $("#txtMobile" + prefix).val().trim();
        const message = $("#txtMessage" + prefix).val().trim();

        if (!name) {
            showEnquiryMessage('Please enter your name.', true);
            $("#txtName" + prefix).focus();
            return false;
        }

        if (!isValidEmail(email)) {
            showEnquiryMessage('Please enter a valid email address.', true);
            $("#txtEmail" + prefix).focus();
            return false;
        }

        if (!isValidMobile(mobile)) {
            showEnquiryMessage('Please enter a valid 10-digit mobile number.', true);
            $("#txtMobile" + prefix).focus();
            return false;
        }

        if (!message) {
            showEnquiryMessage('Please enter your message.', true);
            $("#txtMessage" + prefix).focus();
            return false;
        }

        return { name: name, email: email, mobile: mobile, message: message };
    }

    function handleEnquiry(prefix, label) {
        const data = validateEnquiry(prefix);
        if (!data) return;

        const $button = $("#btn" + label);
        const originalText = $button.text();
        $button.prop('disabled', true).text('Sending...');

        setTimeout(function () {
            $button.prop('disabled', false).text(originalText);
            showEnquiryMessage('Thanks! Your ' + label.toLowerCase() + ' enquiry is ready to be sent.', false);
            $("#enquiryForm")[0].reset();
            $('#local-tab').tab('show');
        }, 500);
    }

    $('#btnLocal').on('click', function () {
        handleEnquiry('L', 'Local');
    });

    $('#btnOutStation').on('click', function () {
        handleEnquiry('O', 'OutStation');
    });

    // Packages section regional tabs and mobile slider logic
    const northIndiaCities = `
        <button class="btn">Agra</button>
        <button class="btn">Bahadurgarh</button>
        <button class="btn">Chandigarh</button>
        <button class="btn">Delhi</button>
        <button class="btn">Gurgaon</button>
        <button class="btn">Jaipur</button>
        <button class="btn">Nainital</button>
        <button class="btn">Rohtak</button>
    `;

    $('.pkg-tabs span').on('click', function () {
        $('.pkg-tabs span').removeClass('active');
        $(this).addClass('active');
        const tabText = $(this).text().trim().toLowerCase();
        if (tabText === 'north india') {
            $('.city-pills').html(northIndiaCities).show();
            $('.pkg-grid').show();
            $('.pkg-dots').addClass('d-flex').removeClass('d-none');
            $('.empty-packages-message').hide();
            $('.slider-nav-container').show();
            $('.pkg-nav-arrows-container').show();
        } else {
            $('.city-pills').empty();
            $('.pkg-grid').hide();
            $('.pkg-dots').removeClass('d-flex').addClass('d-none');
            $('.empty-packages-message').show();
            $('.slider-nav-container').hide();
            $('.pkg-nav-arrows-container').hide();
        }
    });

    $('.pkg-grid').on('scroll', function () {
        const scrollLeft = $(this).scrollLeft();
        const width = $(this).width();
        if (width > 0) {
            const index = Math.round(scrollLeft / width);
            $('.pkg-dots span').removeClass('active');
            $('.pkg-dots span').eq(index).addClass('active');
        }
    });

    // City pills horizontal navigation
    $('.btn-city-next').on('click', function () {
        const $pills = $('.city-pills');
        $pills.animate({ scrollLeft: $pills.scrollLeft() + 200 }, 300);
    });
    $('.btn-city-prev').on('click', function () {
        const $pills = $('.city-pills');
        $pills.animate({ scrollLeft: $pills.scrollLeft() - 200 }, 300);
    });

    // Packages horizontal navigation
    $('.btn-pkg-next').on('click', function () {
        const $grid = $('.pkg-grid');
        const cardWidth = $grid.find('> div').first().outerWidth();
        $grid.animate({ scrollLeft: $grid.scrollLeft() + cardWidth }, 300);
    });
    $('.btn-pkg-prev').on('click', function () {
        const $grid = $('.pkg-grid');
        const cardWidth = $grid.find('> div').first().outerWidth();
        $grid.animate({ scrollLeft: $grid.scrollLeft() - cardWidth }, 300);
    });
});
