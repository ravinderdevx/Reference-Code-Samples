import React from 'react';
import { IntlProvider, FormattedNumber } from 'react-intl';


const CurrencyFormatter = ({ currency }) => {
    const formats = {
        number: {
            USD: {
                style: 'currency',
                currency: 'USD'
            }
        }
    };
   
    return (


        <IntlProvider
            locale='en'
            formats={formats}
            defaultFormats={formats}
        >
            {currency >= 0 ? <FormattedNumber value={currency} minimumFractionDigits={2} maximumFractionDigits={2} format='USD' /> :
                <span>(<FormattedNumber value={currency * -1} minimumFractionDigits={2} maximumFractionDigits={2} format='USD' />)</span>}
        </IntlProvider>
    )
}

export default CurrencyFormatter;