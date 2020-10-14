var $list = $('#lista-tareas').sortable({
    disabled: true,

});

function asignarEventosListaSliderIzquierda() {
    $('.treeview-animated-items-header').click(function (e) {
        var jTarget = $(e.target),
            dir = jTarget.data('dir'),
            jItem = $(e.currentTarget),
            jItems = $('.treeview-animated-items-header'),
            index = jItems.index(jItem);
        switch (dir) {
            case 'up':
                if (index != 0) {
                    var item = $(this).detach().insertBefore(jItems[index - 1]);
                }
                break;
            case 'down':
                if (index != jItems.length - 1) {
                    var item = $(this).detach().insertAfter(jItems[index + 1]);
                }
                break;
        }

        $this = $(this);
        $target = $this.siblings('.nested');
        $pointerPlus = $this.children('.fa-plus-circle');
        $pointerMinus = $this.children('.fa-minus-circle');

        $pointerPlus.removeClass('fa-plus-circle');
        $pointerPlus.addClass('fa-minus-circle');
        $pointerMinus.removeClass('fa-minus-circle');
        $pointerMinus.addClass('fa-plus-circle');
        $this.toggleClass('open')
        if (!$target.hasClass('active')) {
            $target.addClass('active').slideDown();
        } else {
            $target.removeClass('active').slideUp();
        }

        e.stopPropagation()
        return false;


    });

    (function ($) {

        let $allPanels = $('.nested').hide();
        let $elements = $('.treeview-animated-element');

        $elements.click(function () {
            $this = $(this);

            if ($this.hasClass('opened')) {

                $elements.removeClass('opened');
            } else {

                $elements.removeClass('opened');
                $this.addClass('opened');
            }
        })
    })(jQuery);
}



function refrescarTablaTareas() {
    $('#lista-tareas').html('')
    if (Puesto.TareasPuesto != null && Puesto.TareasPuesto.detallesTarea.length > 0) {
        for (const detalle of Puesto.TareasPuesto.detallesTarea) {
            //<button class=" btn-primary btn-lg btn-floating" style="font-size: 20px;" data-dir="up">&#8593;</button>
            //<button class=" btn-danger btn-lg btn-floating" style="font-size: 20px;" data-dir="down">&#8595;</button>
            $('#lista-tareas').append(`
            <li data-z="one" class="tarea treeview-animated-items">
            <a class="treeview-animated-items-header">
                <i class="fas fa-plus-circle"></i>
                <span><i class="far fa-bell ic-w mx-1"></i>1. ${detalle.modelo}</span>
                
            </a>
    
            <ul class="nested">
                <li>
                    <div class="treeview-animated-element"><i
                            class="far fa-address-book ic-w mr-1"></i>${detalle.cliente}</div>
                </li>
                <li>
                    <div class="treeview-animated-element"><i
                            class="fas fa-tools ic-w mr-1"></i>${Puesto.TareasPuesto.utillaje} &lt;${Puesto.TareasPuesto.tallaUtillaje}&gt;</div>
                </li>
                <li>
                    <div class="treeview-animated-element"><i
                            class="fas fa-shoe-prints ic-w mr-1"></i>${detalle.cantidadFabricar}  &lt;${detalle.tallasArticulo.join(',')}&gt;</div>
                </li>
        </li>
            `)
        }
    }


    asignarEventosListaSliderIzquierda()
}