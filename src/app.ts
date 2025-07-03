import {createBot, createProvider, createFlow,MemoryDB, addKeyword } from '@bot-whatsapp/bot'
import {BaileysProvider,handleCtx} from '@bot-whatsapp/provider-baileys'
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const flowBienvenida = addKeyword('hola')
    .addAnswer(['Hola, bienvenido a mi tienda', '¿Como puedo ayudarte?'])

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'files')));

app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    console.log(`📄 Tu PDF está disponible en: http://localhost:${port}/CARTA.pdf`);
});

const main = async () => {

    const provider = createProvider(BaileysProvider)

    provider.initHttpServer(3002)

    

    provider.http.server.post('/send-message',handleCtx(async (bot,req,res)=>{
        const name = req.body.name
        const number =  req.body.number

        const mensaje = `¡Hola ${name}!
Somos el equipo consultor encargado del estudio de demanda académica para la creación de la nueva Segunda Especialidad Profesional de la Universidad Nacional José Faustino Sánchez Carrión. 

Tu experiencia como egresado/a es invaluable para nosotros. Queremos que esta nueva especialidad se adapte perfectamente a las necesidades del mercado laboral y a lo que realmente les servirá para potenciar sus carreras. Para lograrlo, necesitamos tu perspectiva.

Hemos preparado una breve encuesta para validar las competencias clave que consideras esenciales en esta área. ¡Tu participación es crucial para construir un programa de alta calidad y relevante para ti y tus futuros colegas!

https://forms.gle/CthxneVB7b6cCxE48

Adjuntamos la Carta de Invitación por parte de la Decanatura de la Facultad de Ciencias Empresariales - UNJFSC`

        await bot.sendMessage(number,mensaje,{});
        await bot.sendMessage(number,mensaje,{
           media:'http://localhost:3000/CARTA.pdf'
        });
        res.end('Funcionaaa')
    }))

    await createBot({
        flow: createFlow([flowBienvenida]),
        database: new MemoryDB(),
        provider,
    })
}


main();