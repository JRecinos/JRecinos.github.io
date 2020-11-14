export const fetchQuery =  (url, method, body, content="application/json")=> {
    return new Promise(async (solve,reject)=>{
            const headers = new Headers({'Accept': 'application/json','Content-Type': content });

            fetch(url,{
                method: method,
                body: JSON.stringify(body),
                //eliminar
                mode: 'cors',
                headers: headers,
            })
            .then(response=>{
                
                if(!response.ok)
                {
                    reject(response)
                }
                solve(response.json());
            })
            .catch(err=>{
                reject(err);
            })
    });
}