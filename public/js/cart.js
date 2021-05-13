if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
    updateCartTotal()

}

function ready() {
    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        console.log('++++')
        var input = quantityInputs[i]
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1

        }
        input.addEventListener('change', quantityChanged)
    }

    // var addToCartButtons = document.getElementsByClassName('shop-item-button')
    // for (var i = 0; i < addToCartButtons.length; i++) {
    //     var button = addToCartButtons[i]
    //     button.addEventListener('click', addToCartClicked)
    // }

    // document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked() {
    alert('Thank you for your purchase')
}
function quantityChanged(event) {

    var input = event.target

    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1


    }
    updateCartTotal()
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    var tax = 0
    
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        console.log(price)
        console.log(quantity)
        total = total + (price * quantity)
        if(total >= 100){
            tax = 0;
        }else if(total >= 0.0001 && total < 100){
            tax = 10
        }else{
            tax = 0
        }
        
    }
    total = Math.round(total * 100) / 100
    totals = total+tax
    document.getElementsByClassName('cart-total-price')[0].innerText = totals.toFixed(2)
    document.getElementsByClassName('cart-total-price2')[0].innerText = totals.toFixed(2)
    document.getElementsByClassName('cart-total-subtotal')[0].innerText = total.toFixed(2)
    document.getElementsByClassName('cart-total-tax')[0].innerText = tax
}


    

