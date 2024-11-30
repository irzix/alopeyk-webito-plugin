// plugin.ts

import axios from 'axios';
import process from 'process';
import webito, { delivertypesCalculate_input } from 'webito-plugin-sdk'

const starter = new webito.WebitoPlugin('starter');

starter.registerHook(
    webito.hooks.delivertypesCalculate,
    async ({ vars, data }: { vars: { token: string }, data: delivertypesCalculate_input }) => {
        const datainput = JSON.stringify({
            'transport_type': 'motor_taxi',
            'addresses': [{
                'type': 'origin',
                'lat': data.warehouse.location.lat,
                'lng': data.warehouse.location.lng,
            },
            {
                'type': 'destination',
                'lat': data.billing.location.lat,
                'lng': data.billing.location.lng,
            },
            ],
            'has_return': false,
            'cashed': false
        });

        const baseurl = 'https://api.alopeyk.com/api/v2/';
        axios.post(`${baseurl}orders/price/calc`, datainput, {
            headers: {
                'Authorization': 'Bearer ' + vars.token,
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (response.status == 200)
                    return {
                        status: true,
                        cost: response.data.object.final_price,
                        currency: 'IRT'
                    }
                else
                    return {
                        status: false,
                    }
            })
            .catch((error) => {
                return {
                    status: false,
                }
            });
    });

const runPlugin = async (inputData: { hook: string; data: any }) => {
    const result = await starter.executeHook(inputData.hook, inputData.data);
    return result;
};


process.stdin.on('data', async (input) => {
    const msg = JSON.parse(input.toString());
    const result: any = await runPlugin(msg);
    starter.response({ status: result?.status, data: result?.data })
});