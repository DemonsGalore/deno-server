# deno-server

deno run --allow-net server.ts

deno run --allow-net --allow-write --allow-read --allow-plugin --unstable server.ts

Denon:
https://deno.land/x/denon@2.3.2

denon run --allow-net --allow-write --allow-read --allow-plugin --unstable server.ts



mutation {
    addBook(input:{
        title:"Authority"
        author:"Jeff VanderMeer",
        year:2015
    }) {
        id
        title
    }
}