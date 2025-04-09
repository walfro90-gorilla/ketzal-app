"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// import { ComboBox } from "@/components/combobox"
import { Label } from "@radix-ui/react-label"
// import { on } from "events"
import { Controller, useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { useSuppliers } from "@/context/SupplierContext"

// API services import
import { createService, updateService } from "../services.api"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { getSuppliers } from "@/app/(protected)/suppliers/suppliers.api"
import { use, useEffect, useState } from "react"

// Validation schema with zod and zodResolver from react-hook-form to validate the form
import { zodResolver } from "@hookform/resolvers/zod"
import { serviceSchema } from "@/validations/serviceSchema"

import { Alert, Avatar, Space, Card, Col, Row, Table, message, Select, Modal, Checkbox, List, Typography } from "antd"

import Marquee from 'react-fast-marquee';
import ImageUploader from "@/components/images-uploader"

// Import the context and the hook  to use the context  from the ServiceContext
import { useServices } from "@/context/ServiceContext"
import { string } from "zod"
import TourIncludes from "@/components/TourIncludes"
import { ItineraryBuilder } from "@/components/ItineraryBuilder"
import { FAQManager } from "@/components/FAQManager"
import MexicanStatesCitiesPage from "@/src/app/mexican-states-cities/page"
import { MexicanStatesCitiesSelector } from "@/components/MexicanStatesCitiesSelector"

import { cn } from "@/lib/utils"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"



import { PlusCircleOutlined } from "@ant-design/icons"

import { FAQModal } from "@/components/FAQModal"
import { FAQList } from "@/components/FAQList"
import { useFAQs } from "@/hooks/useFAQs"
import type { FAQ } from "@/types/faq"
import VirtualItinerary from "@/components/virtual-itinerary-custom"
import HotelSearch from "@/hotel-search"
import TransportProviderSearch from "@/transport-provider-search"




const { Title } = Typography
interface TourItem {
    id: string
    name: string
}

const initialItems: TourItem[] = [
    { id: "1", name: "Hotel Accommodation" },
    { id: "2", name: "Breakfast" },
    { id: "3", name: "Guided Tours" },
    { id: "4", name: "Transportation" },
    { id: "5", name: "Entry Fees" },
    { id: "6", name: "Wi-Fi" },
    { id: "7", name: "Lunch" },
    { id: "8", name: "Dinner" },
    { id: "9", name: "Travel Insurance" },
    { id: "10", name: "Personal Expenses" },
]



// Define the structure of our data
type StatesCitiesData = {
    [state: string]: string[]
}

// Sample data (you can replace this with your full dataset)
const statesCitiesData: StatesCitiesData =
{
    "Aguascalientes": ["Aguascalientes", "Asientos", "Calvillo", "Cosio", "El Llano", "Jesus Maria", "Pabellon de Arteaga", "Rincon de Romos", "San Francisco de los Romo", "San Jose de Gracia", "Tepezala"],
    "Baja California": ["Ensenada", "Mexicali", "Playas de Rosarito", "Tecate", "Tijuana"],
    "Baja California Sur": ["Comondu", "La Paz", "Loreto", "Los Cabos", "Mulege"],
    "Campeche": ["Calakmul", "Calkini", "Campeche", "Candelaria", "Carmen", "Champoton", "Escarcega", "Hecelchakan", "Hopelchen", "Palizada", "Tenabo"],
    "Coahuila": ["Abasolo", "Acuna", "Allende", "Arteaga", "Candela", "Castanos", "Cuatro Cienegas", "Escobedo", "Francisco I. Madero", "Frontera", "General Cepeda", "Guerrero", "Hidalgo", "Jimenez", "Juarez", "Lamadrid", "Matamoros", "Monclova", "Morelos", "Muzquiz", "Nadadores", "Nava", "Ocampo", "Parras", "Piedras Negras", "Progreso", "Ramos Arizpe", "Sabinas", "Sacramento", "Saltillo", "San Buenaventura", "San Juan de Sabinas", "San Pedro", "Sierra Mojada", "Torreon", "Viesca", "Villa Union", "Zaragoza"],
    "Colima": ["Armeria", "Colima", "Comala", "Coquimatlan", "Cuauhtemoc", "Ixtlahuacan", "Manzanillo", "Minatitlan", "Tecoman", "Villa de Alvarez"],
    "Chiapas": ["Acacoyagua", "Acala", "Acapetahua", "Aldama", "Altamirano", "Amatenango de la Frontera", "Amatenango del Valle", "Amatan", "Angel Albino Corzo", "Arriaga", "Bejucal de Ocampo", "Bella Vista", "Benemerito de las Americas", "Berriozabal", "Bochil", "Cacahoatan", "Capitan Luis Angel Vidal", "Catazaja", "Chalchihuitan", "Chamula", "Chanal", "Chapultenango", "Chenalho", "Chiapa de Corzo", "Chiapilla", "Chicoasen", "Chicomuselo", "Chilon", "Cintalapa", "Coapilla", "Comitan de Dominguez", "Copainala", "El Bosque", "El Parral", "El Porvenir", "Emiliano Zapata", "Escuintla", "Francisco Leon", "Frontera Comalapa", "Frontera Hidalgo", "Huehuetan", "Huitiupan", "Huixtla", "Huixtan", "Ixhuatan", "Ixtacomitan", "Ixtapa", "Ixtapangajoya", "Jiquipilas", "Jitotol", "Juarez", "La Concordia", "La Grandeza", "La Independencia", "La Libertad", "La Trinitaria", "Larrainzar", "Las Margaritas", "Las Rosas", "Mapastepec", "Maravilla Tenejapa", "Marques de Comillas", "Mazapa de Madero", "Mazatan", "Metapa", "Mezcalapa", "Mitontic", "Montecristo de Guerrero", "Motozintla", "Nicolas Ruiz", "Ocosingo", "Ocotepec", "Ocozocoautla de Espinosa", "Ostuacan", "Osumacinta", "Oxchuc", "Palenque", "Pantelho", "Pantepec", "Pichucalco", "Pijijiapan", "Pueblo Nuevo Solistahuacan", "Rayon", "Reforma", "Rincon Chamula San Pedro", "Sabanilla", "Salto de Agua", "San Andres Duraznal", "San Cristobal de las Casas", "San Fernando", "San Juan Cancuc", "San Lucas", "Santiago el Pinar", "Siltepec", "Simojovel", "Sitala", "Socoltenango", "Solosuchiapa", "Soyalo", "Suchiapa", "Suchiate", "Sunuapa", "Tapachula", "Tapalapa", "Tapilula", "Tecpatan", "Tenejapa", "Teopisca", "Tila", "Tonala", "Totolapa", "Tumbala", "Tuxtla Chico", "Tuxtla Gutierrez", "Tuzantan", "Tzimol", "Union Juarez", "Venustiano Carranza", "Villa Comaltitlan", "Villa Corzo", "Villaflores", "Yajalon", "Zinacantan"],
    "Chihuahua": ["Ahumada", "Aldama", "Allende", "Aquiles Serdan", "Ascension", "Bachiniva", "Balleza", "Batopilas de Manuel Gomez Morin", "Bocoyna", "Buenaventura", "Camargo", "Carichi", "Casas Grandes", "Chihuahua", "Chinipas", "Coronado", "Coyame del Sotol", "Cuauhtemoc", "Cusihuiriachi", "Delicias", "Dr. Belisario Dominguez", "El Tule", "Galeana", "Gran Morelos", "Guachochi", "Guadalupe y Calvo", "Guadalupe", "Guazapares", "Guerrero", "Gomez Farias", "Hidalgo del Parral", "Huejotitan", "Ignacio Zaragoza", "Janos", "Jimenez", "Julimes", "Juarez", "La Cruz", "Lopez", "Madera", "Maguarichi", "Manuel Benavides", "Matachi", "Matamoros", "Meoqui", "Morelos", "Moris", "Namiquipa", "Nonoava", "Nuevo Casas Grandes", "Ocampo", "Ojinaga", "Praxedis G. Guerrero", "Riva Palacio", "Rosales", "Rosario", "Samalayuka", "San Francisco de Borja", "San Francisco de Conchos", "San Francisco del Oro", "Santa Barbara", "Santa Isabel", "Satevo", "Saucillo", "Temosachic", "Urique", "Uruachi", "Valle de Zaragoza"],
    "Ciudad de Mexico": ["Alvaro Obregon", "Azcapotzalco", "Benito Juarez", "Coyoacan", "Cuajimalpa de Morelos", "Cuauhtemoc", "Gustavo A. Madero", "Iztacalco", "Iztapalapa", "La Magdalena Contreras", "Miguel Hidalgo", "Milpa Alta", "Tlalpan", "Tlahuac", "Venustiano Carranza", "Xochimilco"],
    "Durango": ["Canatlan", "Canelas", "Coneto de Comonfort", "Cuencame", "Durango", "El Oro", "General Simon Bolivar", "Gomez Palacio", "Guadalupe Victoria", "Guanacevi", "Hidalgo", "Inde", "Lerdo", "Mapimi", "Mezquital", "Nazas", "Nombre de Dios", "Nuevo Ideal", "Ocampo", "Otaez", "Panuco de Coronado", "Penon Blanco", "Poanas", "Pueblo Nuevo", "Rodeo", "San Bernardo", "San Dimas", "San Juan de Guadalupe", "San Juan del Rio", "San Luis del Cordero", "San Pedro del Gallo", "Santa Clara", "Santiago Papasquiaro", "Suchil", "Tamazula", "Tepehuanes", "Tlahualilo", "Topia", "Vicente Guerrero"],
    "Guanajuato": ["Abasolo", "Acambaro", "Apaseo el Alto", "Apaseo el Grande", "Atarjea", "Celaya", "Comonfort", "Coroneo", "Cortazar", "Cueramaro", "Doctor Mora", "Dolores Hidalgo Cuna de la Independencia Nacional", "Guanajuato", "Huanimaro", "Irapuato", "Jaral del Progreso", "Jerecuaro", "Leon", "Manuel Doblado", "Moroleon", "Ocampo", "Penjamo", "Pueblo Nuevo", "Purisima del Rincon", "Romita", "Salamanca", "Salvatierra", "San Diego de la Union", "San Felipe", "San Francisco del Rincon", "San Jose Iturbide", "San Luis de la Paz", "San Miguel de Allende", "Santa Catarina", "Santa Cruz de Juventino Rosas", "Santiago Maravatio", "Silao de la Victoria", "Tarandacuao", "Tarimoro", "Tierra Blanca", "Uriangato", "Valle de Santiago", "Victoria", "Villagran", "Xichu", "Yuriria"],
    "Guerrero": ["Acapulco de Juarez", "Acatepec", "Ahuacuotzingo", "Ajuchitlan del Progreso", "Alcozauca de Guerrero", "Alpoyeca", "Apaxtla", "Arcelia", "Atenango del Rio", "Atlamajalcingo del Monte", "Atlixtac", "Atoyac de Alvarez", "Ayutla de los Libres", "Azoyu", "Benito Juarez", "Buenavista de Cuellar", "Chilapa de Alvarez", "Chilpancingo de los Bravo", "Coahuayutla de Jose Maria Izazaga", "Cochoapa el Grande", "Cocula", "Copala", "Copalillo", "Copanatoyac", "Coyuca de Benitez", "Coyuca de Catalan", "Cuajinicuilapa", "Cualac", "Cuautepec", "Cuetzala del Progreso", "Cutzamala de Pinzon", "Eduardo Neri", "Florencio Villarreal", "General Canuto A. Neri", "General Heliodoro Castillo", "Huamuxtitlan", "Huitzuco de los Figueroa", "Iguala de la Independencia", "Igualapa", "Iliatenco", "Ixcateopan de Cuauhtemoc", "Jose Joaquin de Herrera", "Juan R. Escudero", "Juchitan", "La Union de Isidoro Montes de Oca", "Leonardo Bravo", "Malinaltepec", "Marquelia", "Martir de Cuilapan", "Metlatonoc", "Mochitlan", "Olinala", "Ometepec", "Pedro Ascencio Alquisiras", "Petatlan", "Pilcaya", "Pungarabato", "Quechultenango", "San Luis Acatlan", "San Marcos", "San Miguel Totolapan", "Taxco de Alarcon", "Tecoanapa", "Tecpan de Galeana", "Teloloapan", "Tepecoacuilco de Trujano", "Tetipac", "Tixtla de Guerrero", "Tlacoachistlahuaca", "Tlacoapa", "Tlalchapa", "Tlalixtaquilla de Maldonado", "Tlapa de Comonfort", "Tlapehuala", "Xalpatlahuac", "Xochihuehuetlan", "Xochistlahuaca", "Zapotitlan Tablas", "Zihuatanejo de Azueta", "Zirandaro", "Zitlala"],
    "Hidalgo": ["Acatlan", "Acaxochitlan", "Actopan", "Agua Blanca de Iturbide", "Ajacuba", "Alfajayucan", "Almoloya", "Apan", "Atitalaquia", "Atlapexco", "Atotonilco de Tula", "Atotonilco el Grande", "Calnali", "Cardonal", "Chapantongo", "Chapulhuacan", "Chilcuautla", "Cuautepec de Hinojosa", "El Arenal", "Eloxochitlan", "Emiliano Zapata", "Epazoyucan", "Francisco I. Madero", "Huasca de Ocampo", "Huautla", "Huazalingo", "Huehuetla", "Huejutla de Reyes", "Huichapan", "Ixmiquilpan", "Jacala de Ledezma", "Jaltocan", "Juarez Hidalgo", "La Mision", "Lolotla", "Metepec", "Metztitlan", "Mineral de la Reforma", "Mineral del Chico", "Mineral del Monte", "Mixquiahuala de Juarez", "Molango de Escamilla", "Nicolas Flores", "Nopala de Villagran", "Omitlan de Juarez", "Pachuca de Soto", "Pacula", "Pisaflores", "Progreso de Obregon", "San Agustin Metzquititlan", "San Agustin Tlaxiaca", "San Bartolo Tutotepec", "San Felipe Orizatlan", "San Salvador", "Santiago Tulantepec de Lugo Guerrero", "Santiago de Anaya", "Singuilucan", "Tasquillo", "Tecozautla", "Tenango de Doria", "Tepeapulco", "Tepehuacan de Guerrero", "Tepeji del Rio de Ocampo", "Tepetitlan", "Tetepango", "Tezontepec de Aldama", "Tianguistengo", "Tizayuca", "Tlahuelilpan", "Tlahuiltepa", "Tlanalapa", "Tlanchinol", "Tlaxcoapan", "Tolcayuca", "Tula de Allende", "Tulancingo de Bravo", "Villa de Tezontepec", "Xochiatipan", "Xochicoatlan", "Yahualica", "Zacualtipan de Angeles", "Zapotlan de Juarez", "Zempoala", "Zimapan"],
    "Jalisco": ["Acatic", "Acatlan de Juarez", "Ahualulco de Mercado", "Amacueca", "Amatitan", "Ameca", "Arandas", "Atemajac de Brizuela", "Atengo", "Atenguillo", "Atotonilco el Alto", "Atoyac", "Autlan de Navarro", "Ayotlan", "Ayutla", "Bolanos", "Cabo Corrientes", "Canadas de Obregon", "Casimiro Castillo", "Chapala", "Chimaltitan", "Chiquilistlan", "Cihuatlan", "Cocula", "Colotlan", "Concepcion de Buenos Aires", "Cuautitlan de Garcia Barragan", "Cuautla", "Cuquio", "Degollado", "Ejutla", "El Arenal", "El Grullo", "El Limon", "El Salto", "Encarnacion de Diaz", "Etzatlan", "Gomez Farias", "Guachinango", "Guadalajara", "Hostotipaquillo", "Huejucar", "Huejuquilla el Alto", "Ixtlahuacan de los Membrillos", "Ixtlahuacan del Rio", "Jalostotitlan", "Jamay", "Jesus Maria", "Jilotlan de los Dolores", "Jocotepec", "Juanacatlan", "Juchitlan", "La Barca", "La Huerta", "La Manzanilla de la Paz", "Lagos de Moreno", "Magdalena", "Mascota", "Mazamitla", "Mexticacan", "Mezquitic", "Mixtlan", "Ocotlan", "Ojuelos de Jalisco", "Pihuamo", "Poncitlan", "Puerto Vallarta", "Quitupan", "San Cristobal de la Barranca", "San Diego de Alejandria", "San Gabriel", "San Ignacio Cerro Gordo", "San Juan de los Lagos", "San Juanito de Escobedo", "San Julian", "San Marcos", "San Martin Hidalgo", "San Martin de Bolanos", "San Miguel el Alto", "San Pedro Tlaquepaque", "San Sebastian del Oeste", "Santa Maria de los Angeles", "Santa Maria del Oro", "Sayula", "Tala", "Talpa de Allende", "Tamazula de Gordiano", "Tapalpa", "Tecalitlan", "Techaluta de Montenegro", "Tecolotlan", "Tenamaxtlan", "Teocaltiche", "Teocuitatlan de Corona", "Tepatitlan de Morelos", "Tequila", "Teuchitlan", "Tizapan el Alto", "Tlajomulco de Zuniga", "Toliman", "Tomatlan", "Tonala", "Tonaya", "Tonila", "Totatiche", "Tototlan", "Tuxcacuesco", "Tuxcueca", "Tuxpan", "Union de San Antonio", "Union de Tula", "Valle de Guadalupe", "Valle de Juarez", "Villa Corona", "Villa Guerrero", "Villa Hidalgo", "Villa Purificacion", "Yahualica de Gonzalez Gallo", "Zacoalco de Torres", "Zapopan", "Zapotiltic", "Zapotitlan de Vadillo", "Zapotlan del Rey", "Zapotlan el Grande", "Zapotlanejo"],
    "Estado de Mexico": ["Acambay de Ruiz Castaneda", "Acolman", "Aculco", "Almoloya de Alquisiras", "Almoloya de Juarez", "Almoloya del Rio", "Amanalco", "Amatepec", "Amecameca", "Apaxco", "Atenco", "Atizapan de Zaragoza", "Atizapan", "Atlacomulco", "Atlautla", "Axapusco", "Ayapango", "Calimaya", "Capulhuac", "Chalco", "Chapa de Mota", "Chapultepec", "Chiautla", "Chicoloapan", "Chiconcuac", "Chimalhuacan", "Coacalco de Berriozabal", "Coatepec Harinas", "Cocotitlan", "Coyotepec", "Cuautitlan Izcalli", "Cuautitlan", "Donato Guerra", "Ecatepec de Morelos", "Ecatzingo", "El Oro", "Huehuetoca", "Hueypoxtla", "Huixquilucan", "Isidro Fabela", "Ixtapaluca", "Ixtapan de la Sal", "Ixtapan del Oro", "Ixtlahuaca", "Jaltenco", "Jilotepec", "Jilotzingo", "Jiquipilco", "Jocotitlan", "Joquicingo", "Juchitepec", "La Paz", "Lerma", "Luvianos", "Malinalco", "Melchor Ocampo", "Metepec", "Mexicaltzingo", "Morelos", "Naucalpan de Juarez", "Nextlalpan", "Nezahualcoyotl", "Nicolas Romero", "Nopaltepec", "Ocoyoacac", "Ocuilan", "Otumba", "Otzoloapan", "Otzolotepec", "Ozumba", "Papalotla", "Polotitlan", "Rayon", "San Antonio la Isla", "San Felipe del Progreso", "San Jose del Rincon", "San Martin de las Piramides", "San Mateo Atenco", "San Simon de Guerrero", "Santo Tomas", "Soyaniquilpan de Juarez", "Sultepec", "Tecamac", "Tejupilco", "Temamatla", "Temascalapa", "Temascalcingo", "Temascaltepec", "Temoaya", "Tenancingo", "Tenango del Aire", "Tenango del Valle", "Teoloyucan", "Teotihuacan", "Tepetlaoxtoc", "Tepetlixpa", "Tepotzotlan", "Tequixquiac", "Texcaltitlan", "Texcalyacac", "Texcoco", "Tezoyuca", "Tianguistenco", "Timilpan", "Tlalmanalco", "Tlalnepantla de Baz", "Tlatlaya", "Toluca", "Tonanitla", "Tonatico", "Tultepec", "Tultitlan", "Valle de Bravo", "Valle de Chalco Solidaridad", "Villa Guerrero", "Villa Victoria", "Villa de Allende", "Villa del Carbon", "Xalatlaco", "Xonacatlan", "Zacazonapan", "Zacualpan", "Zinacantepec", "Zumpahuacan", "Zumpango"],
    "Michoacan": ["Acuitzio", "Aguililla", "Alvaro Obregon", "Angamacutiro", "Angangueo", "Apatzingan", "Aporo", "Aquila", "Ario", "Arteaga", "Brisenas", "Buenavista", "Caracuaro", "Charapan", "Charo", "Chavinda", "Cheran", "Chilchota", "Chinicuila", "Chucandiro", "Churintzio", "Churumuco", "Coahuayana", "Coalcoman de Vazquez Pallares", "Coeneo", "Cojumatlan de Regules", "Contepec", "Copandaro", "Cotija", "Cuitzeo", "Ecuandureo", "Epitacio Huerta", "Erongaricuaro", "Gabriel Zamora", "Hidalgo", "Huandacareo", "Huaniqueo", "Huetamo", "Huiramba", "Indaparapeo", "Irimbo", "Ixtlan", "Jacona", "Jimenez", "Jiquilpan", "Jose Sixto Verduzco", "Juarez", "Jungapeo", "La Huacana", "La Piedad", "Lagunillas", "Lazaro Cardenas", "Los Reyes", "Madero", "Maravatio", "Marcos Castellanos", "Morelia", "Morelos", "Mugica", "Nahuatzen", "Nocupetaro", "Nuevo Parangaricutiro", "Nuevo Urecho", "Numaran", "Ocampo", "Pajacuaran", "Panindicuaro", "Paracho", "Paracuaro", "Patzcuaro", "Penjamillo", "Periban", "Purepero", "Puruandiro", "Querendaro", "Quiroga", "Sahuayo", "Salvador Escalante", "San Lucas", "Santa Ana Maya", "Senguio", "Susupuato", "Tacambaro", "Tancitaro", "Tangamandapio", "Tangancicuaro", "Tanhuato", "Taretan", "Tarimbaro", "Tepalcatepec", "Tingambato", "Tinguindin", "Tiquicheo de Nicolas Romero", "Tlalpujahua", "Tlazazalca", "Tocumbo", "Tumbiscatio", "Turicato", "Tuxpan", "Tuzantla", "Tzintzuntzan", "Tzitzio", "Uruapan", "Venustiano Carranza", "Villamar", "Vista Hermosa", "Yurecuaro", "Zacapu", "Zamora", "Zinaparo", "Zinapecuaro", "Ziracuaretiro", "Zitacuaro"],
    "Morelos": ["Amacuzac", "Atlatlahucan", "Axochiapan", "Ayala", "Coatlan del Rio", "Cuautla", "Cuernavaca", "Emiliano Zapata", "Huitzilac", "Jantetelco", "Jiutepec", "Jojutla", "Jonacatepec de Leandro Valle", "Mazatepec", "Miacatlan", "Ocuituco", "Puente de Ixtla", "Temixco", "Temoac", "Tepalcingo", "Tepoztlan", "Tetecala", "Tetela del Volcan", "Tlalnepantla", "Tlaltizapan de Zapata", "Tlaquiltenango", "Tlayacapan", "Totolapan", "Xochitepec", "Yautepec", "Yecapixtla", "Zacatepec", "Zacualpan de Amilpas"],
    "Nayarit": ["Acaponeta", "Ahuacatlan", "Amatlan de Canas", "Bahia de Banderas", "Compostela", "Del Nayar", "Huajicori", "Ixtlan del Rio", "Jala", "La Yesca", "Rosamorada", "Ruiz", "San Blas", "San Pedro Lagunillas", "Santa Maria del Oro", "Santiago Ixcuintla", "Tecuala", "Tepic", "Tuxpan", "Xalisco"],
    "Nuevo Leon": ["Abasolo", "Agualeguas", "Allende", "Anahuac", "Apodaca", "Aramberri", "Bustamante", "Cadereyta Jimenez", "Cerralvo", "China", "Cienega de Flores", "Doctor Arroyo", "Doctor Coss", "Doctor Gonzalez", "El Carmen", "Galeana", "Garcia", "General Bravo", "General Escobedo", "General Teran", "General Trevino", "General Zaragoza", "General Zuazua", "Guadalupe", "Hidalgo", "Higueras", "Hualahuises", "Iturbide", "Juarez", "Lampazos de Naranjo", "Linares", "Los Aldamas", "Los Herreras", "Los Ramones", "Marin", "Melchor Ocampo", "Mier y Noriega", "Mina", "Montemorelos", "Monterrey", "Paras", "Pesqueria", "Rayones", "Sabinas Hidalgo", "Salinas Victoria", "San Nicolas de los Garza", "San Pedro Garza Garcia", "Santa Catarina", "Santiago", "Vallecillo", "Villaldama"],
    "Oaxaca": ["Abejones", "Acatlan de Perez Figueroa", "Animas Trujano", "Asuncion Cacalotepec", "Asuncion Cuyotepeji", "Asuncion Ixtaltepec", "Asuncion Nochixtlan", "Asuncion Ocotlan", "Asuncion Tlacolulita", "Ayoquezco de Aldama", "Ayotzintepec", "Calihuala", "Candelaria Loxicha", "Capulalpam de Mendez", "Chahuites", "Chalcatongo de Hidalgo", "Chiquihuitlan de Benito Juarez", "Cienega de Zimatlan", "Ciudad Ixtepec", "Coatecas Altas", "Coicoyan de las Flores", "Concepcion Buenavista", "Concepcion Papalo", "Constancia del Rosario", "Cosolapa", "Cosoltepec", "Cuilapam de Guerrero", "Cuna de la Independencia de Oaxaca", "Cuyamecalco Villa de Zaragoza", "El Barrio de la Soledad", "El Espinal", "Eloxochitlan de Flores Magon", "Fresnillo de Trujano", "Guadalupe Etla", "Guadalupe de Ramirez", "Guelatao de Juarez", "Guevea de Humboldt", "Heroica Ciudad de Ejutla de Crespo", "Heroica Ciudad de Huajuapan de Leon", "Heroica Ciudad de Juchitan de Zaragoza", "Heroica Ciudad de Tlaxiaco", "Heroica Villa Tezoatlan de Segura y Luna", "Huautepec", "Huautla de Jimenez", "Ixpantepec Nieves", "Ixtlan de Juarez", "La Compania", "La Pe", "La Reforma", "La Trinidad Vista Hermosa", "Loma Bonita", "Magdalena Apasco", "Magdalena Jaltepec", "Magdalena Mixtepec", "Magdalena Ocotlan", "Magdalena Penasco", "Magdalena Teitipac", "Magdalena Tequisistlan", "Magdalena Tlacotepec", "Magdalena Yodocono de Porfirio Diaz", "Magdalena Zahuatlan", "Mariscala de Juarez", "Martires de Tacubaya", "Matias Romero Avendano", "Mazatlan Villa de Flores", "Mesones Hidalgo", "Miahuatlan de Porfirio Diaz", "Mixistlan de la Reforma", "Monjas", "Natividad", "Nazareno Etla", "Nejapa de Madero", "Nuevo Zoquiapam", "Oaxaca de Juarez", "Ocotlan de Morelos", "Pinotepa de Don Luis", "Pluma Hidalgo", "Putla Villa de Guerrero", "Reforma de Pineda", "Reyes Etla", "Rojas de Cuauhtemoc", "Salina Cruz", "San Agustin Amatengo", "San Agustin Atenango", "San Agustin Chayuco", "San Agustin Etla", "San Agustin Loxicha", "San Agustin Tlacotepec", "San Agustin Yatareni", "San Agustin de las Juntas", "San Andres Cabecera Nueva", "San Andres Dinicuiti", "San Andres Huaxpaltepec", "San Andres Huayapam", "San Andres Ixtlahuaca", "San Andres Lagunas", "San Andres Nuxino", "San Andres Paxtlan", "San Andres Sinaxtla", "San Andres Solaga", "San Andres Teotilalpam", "San Andres Tepetlapa", "San Andres Yaa", "San Andres Zabache", "San Andres Zautla", "San Antonino Castillo Velasco", "San Antonino Monte Verde", "San Antonino el Alto", "San Antonio Acutla", "San Antonio Huitepec", "San Antonio Nanahuatipam", "San Antonio Sinicahua", "San Antonio Tepetlapa", "San Antonio de la Cal", "San Baltazar Chichicapam", "San Baltazar Loxicha", "San Baltazar Yatzachi el Bajo", "San Bartolo Coyotepec", "San Bartolo Soyaltepec", "San Bartolo Yautepec", "San Bartolome Ayautla", "San Bartolome Loxicha", "San Bartolome Quialana", "San Bartolome Yucuane", "San Bartolome Zoogocho", "San Bernardo Mixtepec", "San Blas Atempa", "San Carlos Yautepec", "San Cristobal Amatlan", "San Cristobal Amoltepec", "San Cristobal Lachirioag", "San Cristobal Suchixtlahuaca", "San Dionisio Ocotepec", "San Dionisio Ocotlan", "San Dionisio del Mar", "San Esteban Atatlahuca", "San Felipe Jalapa de Diaz", "San Felipe Tejalapam", "San Felipe Usila", "San Francisco Cahuacua", "San Francisco Cajonos", "San Francisco Chapulapa", "San Francisco Chindua", "San Francisco Huehuetlan", "San Francisco Ixhuatan", "San Francisco Jaltepetongo", "San Francisco Lachigolo", "San Francisco Logueche", "San Francisco Nuxano", "San Francisco Ozolotepec", "San Francisco Sola", "San Francisco Telixtlahuaca", "San Francisco Teopan", "San Francisco Tlapancingo", "San Francisco del Mar", "San Gabriel Mixtepec", "San Ildefonso Amatlan", "San Ildefonso Sola", "San Ildefonso Villa Alta", "San Jacinto Amilpas", "San Jacinto Tlacotepec", "San Jeronimo Coatlan", "San Jeronimo Silacayoapilla", "San Jeronimo Sosola", "San Jeronimo Taviche", "San Jeronimo Tecoatl", "San Jeronimo Tlacochahuaya", "San Jorge Nuchita", "San Jose Ayuquila", "San Jose Chiltepec", "San Jose Estancia Grande", "San Jose Independencia", "San Jose Lachiguiri", "San Jose Tenango", "San Jose del Penasco", "San Jose del Progreso", "San Juan Achiutla", "San Juan Atepec", "San Juan Bautista Atatlahuca", "San Juan Bautista Coixtlahuaca", "San Juan Bautista Cuicatlan", "San Juan Bautista Guelache", "San Juan Bautista Jayacatlan", "San Juan Bautista Lo de Soto", "San Juan Bautista Suchitepec", "San Juan Bautista Tlachichilco", "San Juan Bautista Tlacoatzintepec", "San Juan Bautista Tuxtepec", "San Juan Bautista Valle Nacional", "San Juan Cacahuatepec", "San Juan Chicomezuchil", "San Juan Chilateca", "San Juan Cieneguilla", "San Juan Coatzospam", "San Juan Colorado", "San Juan Comaltepec", "San Juan Cotzocon", "San Juan Diuxi", "San Juan Evangelista Analco", "San Juan Guelavia", "San Juan Guichicovi", "San Juan Ihualtepec", "San Juan Juquila Mixes", "San Juan Juquila Vijanos", "San Juan Lachao", "San Juan Lachigalla", "San Juan Lajarcia", "San Juan Lalana", "San Juan Mazatlan", "San Juan Mixtepec", "San Juan Mixtepec", "San Juan Numi", "San Juan Ozolotepec", "San Juan Petlapa", "San Juan Quiahije", "San Juan Quiotepec", "San Juan Sayultepec", "San Juan Tabaa", "San Juan Tamazola", "San Juan Teita", "San Juan Teitipac", "San Juan Tepeuxila", "San Juan Teposcolula", "San Juan Yaee", "San Juan Yatzona", "San Juan Yucuita", "San Juan de los Cues", "San Juan del Estado", "San Juan del Rio", "San Lorenzo Albarradas", "San Lorenzo Cacaotepec", "San Lorenzo Cuaunecuiltitla", "San Lorenzo Texmelucan", "San Lorenzo Victoria", "San Lorenzo", "San Lucas Camotlan", "San Lucas Ojitlan", "San Lucas Quiavini", "San Lucas Zoquiapam", "San Luis Amatlan", "San Marcial Ozolotepec", "San Marcos Arteaga", "San Martin Huamelulpam", "San Martin Itunyoso", "San Martin Lachila", "San Martin Peras", "San Martin Tilcajete", "San Martin Toxpalan", "San Martin Zacatepec", "San Martin de los Cansecos", "San Mateo Cajonos", "San Mateo Etlatongo", "San Mateo Nejapam", "San Mateo Penasco", "San Mateo Pinas", "San Mateo Rio Hondo", "San Mateo Sindihui", "San Mateo Tlapiltepec", "San Mateo Yoloxochitlan", "San Mateo Yucutindoo", "San Mateo del Mar", "San Melchor Betaza", "San Miguel Achiutla", "San Miguel Ahuehuetitlan", "San Miguel Aloapam", "San Miguel Amatitlan", "San Miguel Amatlan", "San Miguel Chicahua", "San Miguel Chimalapa", "San Miguel Coatlan", "San Miguel Ejutla", "San Miguel Huautla", "San Miguel Mixtepec", "San Miguel Panixtlahuaca", "San Miguel Peras", "San Miguel Piedras", "San Miguel Quetzaltepec", "San Miguel Santa Flor", "San Miguel Soyaltepec", "San Miguel Suchixtepec", "San Miguel Tecomatlan", "San Miguel Tenango", "San Miguel Tequixtepec", "San Miguel Tilquiapam", "San Miguel Tlacamama", "San Miguel Tlacotepec", "San Miguel Tulancingo", "San Miguel Yotao", "San Miguel del Puerto", "San Miguel del Rio", "San Miguel el Grande", "San Nicolas Hidalgo", "San Nicolas", "San Pablo Coatlan", "San Pablo Cuatro Venados", "San Pablo Etla", "San Pablo Huitzo", "San Pablo Huixtepec", "San Pablo Macuiltianguis", "San Pablo Tijaltepec", "San Pablo Villa de Mitla", "San Pablo Yaganiza", "San Pedro Amuzgos", "San Pedro Apostol", "San Pedro Atoyac", "San Pedro Cajonos", "San Pedro Comitancillo", "San Pedro Coxcaltepec Cantaros", "San Pedro Huamelula", "San Pedro Huilotepec", "San Pedro Ixcatlan", "San Pedro Ixtlahuaca", "San Pedro Jaltepetongo", "San Pedro Jicayan", "San Pedro Jocotipac", "San Pedro Juchatengo", "San Pedro Martir Quiechapa", "San Pedro Martir Yucuxaco", "San Pedro Martir", "San Pedro Mixtepec", "San Pedro Mixtepec", "San Pedro Molinos", "San Pedro Nopala", "San Pedro Ocopetatillo", "San Pedro Ocotepec", "San Pedro Pochutla", "San Pedro Quiatoni", "San Pedro Sochiapam", "San Pedro Tapanatepec", "San Pedro Taviche", "San Pedro Teozacoalco", "San Pedro Teutila", "San Pedro Tidaa", "San Pedro Topiltepec", "San Pedro Totolapam", "San Pedro Yaneri", "San Pedro Yolox", "San Pedro Yucunama", "San Pedro el Alto", "San Pedro y San Pablo Ayutla", "San Pedro y San Pablo Teposcolula", "San Pedro y San Pablo Tequixtepec", "San Raymundo Jalpan", "San Sebastian Abasolo", "San Sebastian Coatlan", "San Sebastian Ixcapa", "San Sebastian Nicananduta", "San Sebastian Rio Hondo", "San Sebastian Tecomaxtlahuaca", "San Sebastian Teitipac", "San Sebastian Tutla", "San Simon Almolongas", "San Simon Zahuatlan", "San Vicente Coatlan", "San Vicente Lachixio", "San Vicente Nunu", "Santa Ana Ateixtlahuaca", "Santa Ana Cuauhtemoc", "Santa Ana Tavela", "Santa Ana Tlapacoyan", "Santa Ana Yareni", "Santa Ana Zegache", "Santa Ana del Valle", "Santa Ana", "Santa Catalina Quieri", "Santa Catarina Cuixtla", "Santa Catarina Ixtepeji", "Santa Catarina Juquila", "Santa Catarina Lachatao", "Santa Catarina Loxicha", "Santa Catarina Mechoacan", "Santa Catarina Minas", "Santa Catarina Quiane", "Santa Catarina Quioquitani", "Santa Catarina Tayata", "Santa Catarina Ticua", "Santa Catarina Yosonotu", "Santa Catarina Zapoquila", "Santa Cruz Acatepec", "Santa Cruz Amilpas", "Santa Cruz Itundujia", "Santa Cruz Mixtepec", "Santa Cruz Nundaco", "Santa Cruz Papalutla", "Santa Cruz Tacache de Mina", "Santa Cruz Tacahua", "Santa Cruz Tayata", "Santa Cruz Xitla", "Santa Cruz Xoxocotlan", "Santa Cruz Zenzontepec", "Santa Cruz de Bravo", "Santa Gertrudis", "Santa Ines Yatzeche", "Santa Ines de Zaragoza", "Santa Ines del Monte", "Santa Lucia Miahuatlan", "Santa Lucia Monteverde", "Santa Lucia Ocotlan", "Santa Lucia del Camino", "Santa Magdalena Jicotlan", "Santa Maria Alotepec", "Santa Maria Apazco", "Santa Maria Atzompa", "Santa Maria Camotlan", "Santa Maria Chachoapam", "Santa Maria Chilchotla", "Santa Maria Chimalapa", "Santa Maria Colotepec", "Santa Maria Cortijo", "Santa Maria Coyotepec", "Santa Maria Ecatepec", "Santa Maria Guelace", "Santa Maria Guienagati", "Santa Maria Huatulco", "Santa Maria Huazolotitlan", "Santa Maria Ipalapa", "Santa Maria Ixcatlan", "Santa Maria Jacatepec", "Santa Maria Jalapa del Marques", "Santa Maria Jaltianguis", "Santa Maria Lachixio", "Santa Maria Mixtequilla", "Santa Maria Nativitas", "Santa Maria Nduayaco", "Santa Maria Ozolotepec", "Santa Maria Papalo", "Santa Maria Penoles", "Santa Maria Petapa", "Santa Maria Quiegolani", "Santa Maria Sola", "Santa Maria Tataltepec", "Santa Maria Tecomavaca", "Santa Maria Temaxcalapa", "Santa Maria Temaxcaltepec", "Santa Maria Teopoxco", "Santa Maria Tepantlali", "Santa Maria Texcatitlan", "Santa Maria Tlahuitoltepec", "Santa Maria Tlalixtac", "Santa Maria Tonameca", "Santa Maria Totolapilla", "Santa Maria Xadani", "Santa Maria Yalina", "Santa Maria Yavesia", "Santa Maria Yolotepec", "Santa Maria Yosoyua", "Santa Maria Yucuhiti", "Santa Maria Zacatepec", "Santa Maria Zaniza", "Santa Maria Zoquitlan", "Santa Maria del Rosario", "Santa Maria del Tule", "Santa Maria la Asuncion", "Santiago Amoltepec", "Santiago Apoala", "Santiago Apostol", "Santiago Astata", "Santiago Atitlan", "Santiago Ayuquililla", "Santiago Cacaloxtepec", "Santiago Camotlan", "Santiago Chazumba", "Santiago Choapam", "Santiago Comaltepec", "Santiago Huajolotitlan", "Santiago Huauclilla", "Santiago Ihuitlan Plumas", "Santiago Ixcuintepec", "Santiago Ixtayutla", "Santiago Jamiltepec", "Santiago Jocotepec", "Santiago Juxtlahuaca", "Santiago Lachiguiri", "Santiago Lalopa", "Santiago Laollaga", "Santiago Laxopa", "Santiago Llano Grande", "Santiago Matatlan", "Santiago Miltepec", "Santiago Minas", "Santiago Nacaltepec", "Santiago Nejapilla", "Santiago Niltepec", "Santiago Nundiche", "Santiago Nuyoo", "Santiago Pinotepa Nacional", "Santiago Suchilquitongo", "Santiago Tamazola", "Santiago Tapextla", "Santiago Tenango", "Santiago Tepetlapa", "Santiago Tetepec", "Santiago Texcalcingo", "Santiago Textitlan", "Santiago Tilantongo", "Santiago Tillo", "Santiago Tlazoyaltepec", "Santiago Xanica", "Santiago Xiacui", "Santiago Yaitepec", "Santiago Yaveo", "Santiago Yolomecatl", "Santiago Yosondua", "Santiago Yucuyachi", "Santiago Zacatepec", "Santiago Zoochila", "Santiago del Rio", "Santo Domingo Albarradas", "Santo Domingo Armenta", "Santo Domingo Chihuitan", "Santo Domingo Ingenio", "Santo Domingo Ixcatlan", "Santo Domingo Nuxaa", "Santo Domingo Ozolotepec", "Santo Domingo Petapa", "Santo Domingo Roayaga", "Santo Domingo Tehuantepec", "Santo Domingo Teojomulco", "Santo Domingo Tepuxtepec", "Santo Domingo Tlatayapam", "Santo Domingo Tomaltepec", "Santo Domingo Tonala", "Santo Domingo Tonaltepec", "Santo Domingo Xagacia", "Santo Domingo Yanhuitlan", "Santo Domingo Yodohino", "Santo Domingo Zanatepec", "Santo Domingo de Morelos", "Santo Tomas Jalieza", "Santo Tomas Mazaltepec", "Santo Tomas Ocotepec", "Santo Tomas Tamazulapan", "Santos Reyes Nopala", "Santos Reyes Papalo", "Santos Reyes Tepejillo", "Santos Reyes Yucuna", "Silacayoapam", "Sitio de Xitlapehua", "Soledad Etla", "Tamazulapam del Espiritu Santo", "Tanetze de Zaragoza", "Taniche", "Tataltepec de Valdes", "Teococuilco de Marcos Perez", "Teotitlan de Flores Magon", "Teotitlan del Valle", "Teotongo", "Tepelmeme Villa de Morelos", "Tlacolula de Matamoros", "Tlacotepec Plumas", "Tlalixtac de Cabrera", "Totontepec Villa de Morelos", "Trinidad Zaachila", "Union Hidalgo", "Valerio Trujano", "Villa Diaz Ordaz", "Villa Hidalgo", "Villa Sola de Vega", "Villa Talea de Castro", "Villa Tejupam de la Union", "Villa de Chilapa de Diaz", "Villa de Etla", "Villa de Tamazulapam del Progreso", "Villa de Tututepec", "Villa de Zaachila", "Yaxe", "Yogana", "Yutanduchi de Guerrero", "Zapotitlan Lagunas", "Zapotitlan Palmas", "Zimatlan de Alvarez"],
    "Puebla": ["Acajete", "Acateno", "Acatlan", "Acatzingo", "Acteopan", "Ahuacatlan", "Ahuatlan", "Ahuazotepec", "Ahuehuetitla", "Ajalpan", "Albino Zertuche", "Aljojuca", "Altepexi", "Amixtlan", "Amozoc", "Aquixtla", "Atempan", "Atexcal", "Atlequizayan", "Atlixco", "Atoyatempan", "Atzala", "Atzitzihuacan", "Atzitzintla", "Axutla", "Ayotoxco de Guerrero", "Calpan", "Caltepec", "Camocuautla", "Canada Morelos", "Caxhuacan", "Chalchicomula de Sesma", "Chapulco", "Chiautla", "Chiautzingo", "Chichiquila", "Chiconcuautla", "Chietla", "Chigmecatitlan", "Chignahuapan", "Chignautla", "Chila de la Sal", "Chila", "Chilchotla", "Chinantla", "Coatepec", "Coatzingo", "Cohetzala", "Cohuecan", "Coronango", "Coxcatlan", "Coyomeapan", "Coyotepec", "Cuapiaxtla de Madero", "Cuautempan", "Cuautinchan", "Cuautlancingo", "Cuayuca de Andrade", "Cuetzalan del Progreso", "Cuyoaco", "Domingo Arenas", "Eloxochitlan", "Epatlan", "Esperanza", "Francisco Z. Mena", "General Felipe Angeles", "Guadalupe Victoria", "Guadalupe", "Hermenegildo Galeana", "Honey", "Huaquechula", "Huatlatlauca", "Huauchinango", "Huehuetla", "Huehuetlan el Chico", "Huehuetlan el Grande", "Huejotzingo", "Hueyapan", "Hueytamalco", "Hueytlalpan", "Huitzilan de Serdan", "Huitziltepec", "Ixcamilpa de Guerrero", "Ixcaquixtla", "Ixtacamaxtitlan", "Ixtepec", "Izucar de Matamoros", "Jalpan", "Jolalpan", "Jonotla", "Jopala", "Juan C. Bonilla", "Juan Galindo", "Juan N. Mendez", "La Magdalena Tlatlauquitepec", "Lafragua", "Libres", "Los Reyes de Juarez", "Mazapiltepec de Juarez", "Mixtla", "Molcaxac", "Naupan", "Nauzontla", "Nealtican", "Nicolas Bravo", "Nopalucan", "Ocotepec", "Ocoyucan", "Olintla", "Oriental", "Pahuatlan", "Palmar de Bravo", "Pantepec", "Petlalcingo", "Piaxtla", "Puebla", "Quecholac", "Quimixtlan", "Rafael Lara Grajales", "San Andres Cholula", "San Antonio Canada", "San Diego la Mesa Tochimiltzingo", "San Felipe Teotlalcingo", "San Felipe Tepatlan", "San Gabriel Chilac", "San Gregorio Atzompa", "San Jeronimo Tecuanipan", "San Jeronimo Xayacatlan", "San Jose Chiapa", "San Jose Miahuatlan", "San Juan Atenco", "San Juan Atzompa", "San Martin Texmelucan", "San Martin Totoltepec", "San Matias Tlalancaleca", "San Miguel Ixitlan", "San Miguel Xoxtla", "San Nicolas Buenos Aires", "San Nicolas de los Ranchos", "San Pablo Anicano", "San Pedro Cholula", "San Pedro Yeloixtlahuaca", "San Salvador Huixcolotla", "San Salvador el Seco", "San Salvador el Verde", "San Sebastian Tlacotepec", "Santa Catarina Tlaltempan", "Santa Ines Ahuatempan", "Santa Isabel Cholula", "Santiago Miahuatlan", "Santo Tomas Hueyotlipan", "Soltepec", "Tecali de Herrera", "Tecamachalco", "Tecomatlan", "Tehuacan", "Tehuitzingo", "Tenampulco", "Teopantlan", "Teotlalco", "Tepanco de Lopez", "Tepango de Rodriguez", "Tepatlaxco de Hidalgo", "Tepeaca", "Tepemaxalco", "Tepeojuma", "Tepetzintla", "Tepexco", "Tepexi de Rodriguez", "Tepeyahualco de Cuauhtemoc", "Tepeyahualco", "Tetela de Ocampo", "Teteles de Avila Castillo", "Teziutlan", "Tianguismanalco", "Tilapa", "Tlachichuca", "Tlacotepec de Benito Juarez", "Tlacuilotepec", "Tlahuapan", "Tlaltenango", "Tlanepantla", "Tlaola", "Tlapacoya", "Tlapanala", "Tlatlauquitepec", "Tlaxco", "Tochimilco", "Tochtepec", "Totoltepec de Guerrero", "Tulcingo", "Tuzamapan de Galeana", "Tzicatlacoyan", "Venustiano Carranza", "Vicente Guerrero", "Xayacatlan de Bravo", "Xicotepec", "Xicotlan", "Xiutetelco", "Xochiapulco", "Xochiltepec", "Xochitlan Todos Santos", "Xochitlan de Vicente Suarez", "Yaonahuac", "Yehualtepec", "Zacapala", "Zacapoaxtla", "Zacatlan", "Zapotitlan de Mendez", "Zapotitlan", "Zaragoza", "Zautla", "Zihuateutla", "Zinacatepec", "Zongozotla", "Zoquiapan", "Zoquitlan"],
    "Queretaro": ["Amealco de Bonfil", "Arroyo Seco", "Cadereyta de Montes", "Colon", "Corregidora", "El Marques", "Ezequiel Montes", "Huimilpan", "Jalpan de Serra", "Landa de Matamoros", "Pedro Escobedo", "Penamiller", "Pinal de Amoles", "Queretaro", "San Joaquin", "San Juan del Rio", "Tequisquiapan", "Toliman"],
    "Quintana Roo": ["Bacalar", "Benito Juarez", "Cozumel", "Felipe Carrillo Puerto", "Isla Mujeres", "Jose Maria Morelos", "Lazaro Cardenas", "Othon P. Blanco", "Puerto Morelos", "Solidaridad", "Tulum"],
    "San Luis Potosi": ["Ahualulco", "Alaquines", "Aquismon", "Armadillo de los Infante", "Axtla de Terrazas", "Cardenas", "Catorce", "Cedral", "Cerritos", "Cerro de San Pedro", "Charcas", "Ciudad Fernandez", "Ciudad Valles", "Ciudad del Maiz", "Coxcatlan", "Ebano", "El Naranjo", "Guadalcazar", "Huehuetlan", "Lagunillas", "Matehuala", "Matlapa", "Mexquitic de Carmona", "Moctezuma", "Rayon", "Rioverde", "Salinas", "San Antonio", "San Ciro de Acosta", "San Luis Potosi", "San Martin Chalchicuautla", "San Nicolas Tolentino", "San Vicente Tancuayalab", "Santa Catarina", "Santa Maria del Rio", "Santo Domingo", "Soledad de Graciano Sanchez", "Tamasopo", "Tamazunchale", "Tampacan", "Tampamolon Corona", "Tamuin", "Tancanhuitz", "Tanlajas", "Tanquian de Escobedo", "Tierra Nueva", "Vanegas", "Venado", "Villa Hidalgo", "Villa Juarez", "Villa de Arista", "Villa de Arriaga", "Villa de Guadalupe", "Villa de Ramos", "Villa de Reyes", "Villa de la Paz", "Xilitla", "Zaragoza"],
    "Sinaloa": ["Ahome", "Angostura", "Badiraguato", "Choix", "Concordia", "Cosala", "Culiacan", "El Fuerte", "Elota", "Escuinapa", "Guasave", "Mazatlan", "Mocorito", "Navolato", "Rosario", "Salvador Alvarado", "San Ignacio", "Sinaloa"],
    "Sonora": ["Aconchi", "Agua Prieta", "Alamos", "Altar", "Arivechi", "Arizpe", "Atil", "Bacadehuachi", "Bacanora", "Bacerac", "Bacoachi", "Bacum", "Banamichi", "Baviacora", "Bavispe", "Benito Juarez", "Benjamin Hill", "Caborca", "Cajeme", "Cananea", "Carbo", "Cucurpe", "Cumpas", "Divisaderos", "Empalme", "Etchojoa", "Fronteras", "General Plutarco Elias Calles", "Granados", "Guaymas", "Hermosillo", "Huachinera", "Huasabas", "Huatabampo", "Huepac", "Imuris", "La Colorada", "Magdalena", "Mazatan", "Moctezuma", "Naco", "Nacori Chico", "Nacozari de Garcia", "Navojoa", "Nogales", "Onavas", "Opodepe", "Oquitoa", "Pitiquito", "Puerto Penasco", "Quiriego", "Rayon", "Rosario", "Sahuaripa", "San Felipe de Jesus", "San Ignacio Rio Muerto", "San Javier", "San Luis Rio Colorado", "San Miguel de Horcasitas", "San Pedro de la Cueva", "Santa Ana", "Santa Cruz", "Saric", "Soyopa", "Suaqui Grande", "Tepache", "Trincheras", "Tubutama", "Ures", "Villa Hidalgo", "Villa Pesqueira", "Yecora"],
    "Tabasco": ["Balancan", "Cardenas", "Centla", "Centro", "Comalcalco", "Cunduacan", "Emiliano Zapata", "Huimanguillo", "Jalapa", "Jalpa de Mendez", "Jonuta", "Macuspana", "Nacajuca", "Paraiso", "Tacotalpa", "Teapa", "Tenosique"],
    "Tamaulipas": ["Abasolo", "Aldama", "Altamira", "Antiguo Morelos", "Burgos", "Bustamante", "Camargo", "Casas", "Ciudad Madero", "Cruillas", "El Mante", "Gomez Farias", "Gonzalez", "Guemez", "Guerrero", "Gustavo Diaz Ordaz", "Hidalgo", "Jaumave", "Jimenez", "Llera", "Mainero", "Matamoros", "Mendez", "Mier", "Miguel Aleman", "Miquihuana", "Nuevo Laredo", "Nuevo Morelos", "Ocampo", "Padilla", "Palmillas", "Reynosa", "Rio Bravo", "San Carlos", "San Fernando", "San Nicolas", "Soto la Marina", "Tampico", "Tula", "Valle Hermoso", "Victoria", "Villagran", "Xicotencatl"],
    "Tlaxcala": ["Acuamanala de Miguel Hidalgo", "Amaxac de Guerrero", "Apetatitlan de Antonio Carvajal", "Apizaco", "Atlangatepec", "Atltzayanca", "Benito Juarez", "Calpulalpan", "Chiautempan", "Contla de Juan Cuamatzi", "Cuapiaxtla", "Cuaxomulco", "El Carmen Tequexquitla", "Emiliano Zapata", "Espanita", "Huamantla", "Hueyotlipan", "Ixtacuixtla de Mariano Matamoros", "Ixtenco", "La Magdalena Tlaltelulco", "Lazaro Cardenas", "Mazatecochco de Jose Maria Morelos", "Munoz de Domingo Arenas", "Nanacamilpa de Mariano Arista", "Nativitas", "Panotla", "Papalotla de Xicohtencatl", "San Damian Texoloc", "San Francisco Tetlanohcan", "San Jeronimo Zacualpan", "San Jose Teacalco", "San Juan Huactzinco", "San Lorenzo Axocomanitla", "San Lucas Tecopilco", "San Pablo del Monte", "Sanctorum de Lazaro Cardenas", "Santa Ana Nopalucan", "Santa Apolonia Teacalco", "Santa Catarina Ayometla", "Santa Cruz Quilehtla", "Santa Cruz Tlaxcala", "Santa Isabel Xiloxoxtla", "Tenancingo", "Teolocholco", "Tepetitla de Lardizabal", "Tepeyanco", "Terrenate", "Tetla de la Solidaridad", "Tetlatlahuca", "Tlaxcala", "Tlaxco", "Tocatlan", "Totolac", "Tzompantepec", "Xaloztoc", "Xaltocan", "Xicohtzinco", "Yauhquemehcan", "Zacatelco", "Ziltlaltepec de Trinidad Sanchez Santos"],
    "Veracruz": ["Acajete", "Acatlan", "Acayucan", "Actopan", "Acula", "Acultzingo", "Agua Dulce", "Alamo Temapache", "Alpatlahuac", "Alto Lucero de Gutierrez Barrios", "Altotonga", "Alvarado", "Amatitlan", "Amatlan de los Reyes", "Angel R. Cabada", "Apazapan", "Aquila", "Astacinga", "Atlahuilco", "Atoyac", "Atzacan", "Atzalan", "Ayahualulco", "Banderilla", "Benito Juarez", "Boca del Rio", "Calcahualco", "Camaron de Tejeda", "Camerino Z. Mendoza", "Carlos A. Carrillo", "Carrillo Puerto", "Castillo de Teayo", "Catemaco", "Cazones de Herrera", "Cerro Azul", "Chacaltianguis", "Chalma", "Chiconamel", "Chiconquiaco", "Chicontepec", "Chinameca", "Chinampa de Gorostiza", "Chocaman", "Chontla", "Chumatlan", "Citlaltepetl", "Coacoatzintla", "Coahuitlan", "Coatepec", "Coatzacoalcos", "Coatzintla", "Coetzala", "Colipa", "Comapa", "Cordoba", "Cosamaloapan de Carpio", "Cosautlan de Carvajal", "Coscomatepec", "Cosoleacaque", "Cotaxtla", "Coxquihui", "Coyutla", "Cuichapa", "Cuitlahuac", "El Higo", "Emiliano Zapata", "Espinal", "Filomeno Mata", "Fortin", "Gutierrez Zamora", "Hidalgotitlan", "Huatusco", "Huayacocotla", "Hueyapan de Ocampo", "Huiloapan de Cuauhtemoc", "Ignacio de la Llave", "Ilamatlan", "Isla", "Ixcatepec", "Ixhuacan de los Reyes", "Ixhuatlan de Madero", "Ixhuatlan del Cafe", "Ixhuatlan del Sureste", "Ixhuatlancillo", "Ixmatlahuacan", "Ixtaczoquitlan", "Jalacingo", "Jalcomulco", "Jaltipan", "Jamapa", "Jesus Carranza", "Jilotepec", "Jose Azueta", "Juan Rodriguez Clara", "Juchique de Ferrer", "La Antigua", "La Perla", "Landero y Coss", "Las Choapas", "Las Minas", "Las Vigas de Ramirez", "Lerdo de Tejada", "Los Reyes", "Magdalena", "Maltrata", "Manlio Fabio Altamirano", "Mariano Escobedo", "Martinez de la Torre", "Mecatlan", "Mecayapan", "Medellin de Bravo", "Miahuatlan", "Minatitlan", "Misantla", "Mixtla de Altamirano", "Moloacan", "Nanchital de Lazaro Cardenas del Rio", "Naolinco", "Naranjal", "Naranjos Amatlan", "Nautla", "Nogales", "Oluta", "Omealca", "Orizaba", "Otatitlan", "Oteapan", "Ozuluama de Mascarenas", "Pajapan", "Panuco", "Papantla", "Paso de Ovejas", "Paso del Macho", "Perote", "Platon Sanchez", "Playa Vicente", "Poza Rica de Hidalgo", "Pueblo Viejo", "Puente Nacional", "Rafael Delgado", "Rafael Lucio", "Rio Blanco", "Saltabarranca", "San Andres Tenejapan", "San Andres Tuxtla", "San Juan Evangelista", "San Rafael", "Santiago Sochiapan", "Santiago Tuxtla", "Sayula de Aleman", "Sochiapa", "Soconusco", "Soledad Atzompa", "Soledad de Doblado", "Soteapan", "Tamalin", "Tamiahua", "Tampico Alto", "Tancoco", "Tantima", "Tantoyuca", "Tatahuicapan de Juarez", "Tatatila", "Tecolutla", "Tehuipango", "Tempoal", "Tenampa", "Tenochtitlan", "Teocelo", "Tepatlaxco", "Tepetlan", "Tepetzintla", "Tequila", "Texcatepec", "Texhuacan", "Texistepec", "Tezonapa", "Tierra Blanca", "Tihuatlan", "Tlachichilco", "Tlacojalpan", "Tlacolulan", "Tlacotalpan", "Tlacotepec de Mejia", "Tlalixcoyan", "Tlalnelhuayocan", "Tlaltetela", "Tlapacoyan", "Tlaquilpa", "Tlilapan", "Tomatlan", "Tonayan", "Totutla", "Tres Valles", "Tuxpan", "Tuxtilla", "Ursulo Galvan", "Uxpanapa", "Vega de Alatorre", "Veracruz", "Villa Aldama", "Xalapa", "Xico", "Xoxocotla", "Yanga", "Yecuatla", "Zacualpan", "Zaragoza", "Zentla", "Zongolica", "Zontecomatlan de Lopez y Fuentes", "Zozocolco de Hidalgo"],
    "Yucatan": ["Abala", "Acanceh", "Akil", "Baca", "Bokoba", "Buctzotz", "Cacalchen", "Calotmul", "Cansahcab", "Cantamayec", "Celestun", "Cenotillo", "Chacsinkin", "Chankom", "Chapab", "Chemax", "Chichimila", "Chicxulub Pueblo", "Chikindzonot", "Chochola", "Chumayel", "Conkal", "Cuncunul", "Cuzama", "Dzan", "Dzemul", "Dzidzantun", "Dzilam Gonzalez", "Dzilam de Bravo", "Dzitas", "Dzoncauich", "Espita", "Halacho", "Hocaba", "Hoctun", "Homun", "Huhi", "Hunucma", "Ixil", "Izamal", "Kanasin", "Kantunil", "Kaua", "Kinchil", "Kopoma", "Mama", "Mani", "Maxcanu", "Mayapan", "Merida", "Mococha", "Motul", "Muna", "Muxupip", "Opichen", "Oxkutzcab", "Panaba", "Peto", "Progreso", "Quintana Roo", "Rio Lagartos", "Sacalum", "Samahil", "San Felipe", "Sanahcat", "Santa Elena", "Seye", "Sinanche", "Sotuta", "Sucila", "Sudzal", "Suma", "Tahdziu", "Tahmek", "Teabo", "Tecoh", "Tekal de Venegas", "Tekanto", "Tekax", "Tekit", "Tekom", "Telchac Pueblo", "Telchac Puerto", "Temax", "Temozon", "Tepakan", "Tetiz", "Teya", "Ticul", "Timucuy", "Tinum", "Tixcacalcupul", "Tixkokob", "Tixmehuac", "Tixpehual", "Tizimin", "Tunkas", "Tzucacab", "Uayma", "Ucu", "Uman", "Valladolid", "Xocchel", "Yaxcaba", "Yaxkukul", "Yobain"],
    "Zacatecas": ["Apozol", "Apulco", "Atolinga", "Benito Juarez", "Calera", "Canitas de Felipe Pescador", "Chalchihuites", "Concepcion del Oro", "Cuauhtemoc", "El Plateado de Joaquin Amaro", "El Salvador", "Fresnillo", "Genaro Codina", "General Enrique Estrada", "General Francisco R. Murguia", "General Panfilo Natera", "Guadalupe", "Huanusco", "Jalpa", "Jerez", "Jimenez del Teul", "Juan Aldama", "Juchipila", "Loreto", "Luis Moya", "Mazapil", "Melchor Ocampo", "Mezquital del Oro", "Miguel Auza", "Momax", "Monte Escobedo", "Morelos", "Moyahua de Estrada", "Nochistlan de Mejia", "Noria de Angeles", "Ojocaliente", "Panuco", "Pinos", "Rio Grande", "Sain Alto", "Santa Maria de la Paz", "Sombrerete", "Susticacan", "Tabasco", "Tepechitlan", "Tepetongo", "Teul de Gonzalez Ortega", "Tlaltenango de Sanchez Roman", "Trancoso", "Trinidad Garcia de la Cadena", "Valparaiso", "Vetagrande", "Villa Garcia", "Villa Gonzalez Ortega", "Villa Hidalgo", "Villa de Cos", "Villanueva", "Zacatecas"]
}



// --------------------------------------------------------------------- IMPORTS  ----------------------------------------------------------- //


interface Include {
    title: string
}





export function ServiceForm({ service, session }) {


    // FAQs STATEs  
    const { faqs, addFAQ, updateFAQ, deleteFAQ } = useFAQs()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingFAQ, setEditingFAQ] = useState<FAQ | undefined>(undefined)
    const [searchTerm, setSearchTerm] = useState("")

    //   Location STATEs    ORRIGEN
    const [selectedState, setSelectedState] = useState<string | null>(null)
    const [selectedCity, setSelectedCity] = useState<string | null>(null)
    const [cities, setCities] = useState<string[]>([])

    //   Location STATEs DESTINO
    const [selectedStateTo, setSelectedStateTo] = useState<string | null>(null)
    const [selectedCityTo, setSelectedCityTo] = useState<string | null>(null)
    const [citiesTo, setCitiesTo] = useState<string[]>([])

    const [includes, setIncludes] = useState<string[]>([])
    const [excludes, setexcludes] = useState<string[]>([])



    const handleIncludeChange = (name: string) => {

        const newInclude: Include = {
            title: name
        }

        setIncludes((prev) => {
            if (prev.includes(newInclude.title)) {
                return prev.filter((item) => item !== newInclude.title)
            } else {
                setexcludes((prev) => prev.filter((item) => item !== newInclude.title))
                return [...prev, newInclude.title]
            }
        })
        console.log("Includes", includes)

    }

    const handleNotIncludeChange = (name: string) => {

        const newExclude: Include = {
            title: name
        }

        setexcludes((prev) => {
            if (prev.includes(newExclude.title)) {
                return prev.filter((item) => item !== newExclude.title)
            } else {
                setIncludes((prev) => prev.filter((item) => item !== newExclude.title))
                return [...prev, newExclude.title]
            }
        })

        console.log("Excludes", excludes)


    }

    // state para cargar las ciudades dependiendo del estado seleccionado



    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    // Use the hook to get the context
    const { images, setImages, activities, setActivities, transportProviderID, setTransportProviderID } = useServices()


    const values = useSuppliers()
    const { getIdSupplier } = useSuppliers()

    const router = useRouter()
    const params = useParams<{ id: string }>()

    // STATEs for packages
    const [pack, setPack] = useState<{ name: string, description: string, qty: number, price: number }>({ name: '', description: '', qty: 0, price: 0 })
    const [packs, setPacks] = useState<{ data: { name: string, description: string, qty: number, price: number }[] }>({ data: [] })

    // STATE FOR suppliers
    const [suppliers, setSuppliers] = useState<{ id: number, name: string }[]>([])
    const [selectedSupplier, setSelectedSupplier] = useState<{ id: number, name: string } | undefined>(undefined)

    // // // MESSAGE API from antd
    const [messageApi, contextHolder] = message.useMessage();
    // WARNING message 
    const warning = ({ content }: { content: string }) => {
        messageApi.open({
            type: 'warning',
            content: content,
        });
    };
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'This is a success message',
        });
    };

    const error = ({ content }: { content: string }) => {
        messageApi.open({
            type: 'error',
            content: content,
        });
    };



    // USE EFFECT TO FETCH suppliers
    useEffect(() => {



        setValue("includes", includes)
        setValue("excludes", excludes)
        setValue("faqs", faqs)

        console.log("images", images)
        console.log("Errors: ", errors);
        setValue("itinerary", activities)
        setValue("transportProviderID", transportProviderID)

        if (images) {
            setValue("images", {
                imgBanner: images.imgBanner || "",
                imgAlbum: images.imgAlbum || "",
            });
        }

        if (errors.name) {
            warning({ content: "Se necesitan todos los campos" })
        }

        const fetchSuppliers = async () => {
            try {
                const suppliersData = await getSuppliers()
                setSuppliers(suppliersData)
                // Find the supplier by session.user.supplierId
                const selected = suppliersData.find(supplier => supplier.id === session.user.supplierId);
                setSelectedSupplier(selected)

            } catch (error) {
                console.log("Failed to fetch suppliers", error)
            }
        }
        fetchSuppliers()


        if (selectedState) {
            setCities(statesCitiesData[selectedState] || [])
        } else {
            setCities([])
        }
        // setSelectedCity(null)

        if (selectedStateTo) {
            setCitiesTo(statesCitiesData[selectedStateTo] || [])
        } else {
            setCitiesTo([])
        }
        // setSelectedCityTo(null)


    }, [images, selectedState, selectedStateTo, includes, excludes, faqs, activities])

    // USE FORM HOOK: useForm, zodResolver, register, handleSubmit and setValue from react-hook-form
    const { control, register, handleSubmit, setValue, getValues, formState: { errors } } = useForm(
        {
            defaultValues: {
                supplierId: service?.supplierId,
                name: service?.name,
                description: service?.description,
                price: service?.price,
                location: service?.location,
                availableFrom: service?.availableFrom,
                availableTo: service?.availableTo,
                packs: service?.packs,
                images: service?.images,
                ytLink: service?.ytLink,
                sizeTour: service?.sizeTourM,
                serviceType: service?.serviceType,
                serviceCategory: service?.serviceCategory,
                stateFrom: service?.stateFrom,
                cityFrom: service?.cityFrom,
                stateTo: service?.stateTo,
                cityTo: service?.cityTo,
                includes: service?.includes,
                excludes: service?.excludes,
                faqs: service?.faqs,
                itinerary: service?.activities,
                transportProviderID: service?.transportProviderID,
            },
            // add zod resolver to the form with the schema created
            resolver: zodResolver(serviceSchema)
        }
    )

    // SUBMIT function to handle the form submission
    const onSubmit = async (data: any) => {

        try {
            if (!service) {
                await updateService(service.id, { ...data, supplierId: values.idSupplier })
            } else {
                await createService({ ...data, supplierId: session.user.supplierId })
            }
            // Handle successful form submission
        } catch (error) {
            console.error("Failed to submit form", error)
        }
        router.push("/services")
        router.refresh()
    }

    const handleSubmitInclusions = async (e: any) => {
        e.preventDefault()
        setValue("includes", includes)
        setValue("excludes", excludes)

        console.log("Inclusions:", includes, excludes)
    }

    // Handle submit for add packages //
    const handleSbmitPcks = async (e: any) => {
        e.preventDefault() // Prevent the form from submitting
        if (!pack.name || !pack.description || !pack.price || !pack.qty) { // Check if the package has all the required fields
            warning({ content: 'Ingresa todos los datos del paquete' }) // Show a warning message
            return; // Stop the function
        }

        const updatedPacks = { data: [...packs.data, pack] } // Create a new list of packages with the new package

        setPacks(updatedPacks)  // Add the new package to the list of packages
        setPack({ name: '', description: '', qty: 0, price: 0 }) // Reset the package state
        setValue("packs", updatedPacks) // Set the value of the packages field to the updated list of packages

        console.log("PACKS:", updatedPacks)
        console.log("Form Packs:", getValues("packs"));


    }

    // Handle delete package 
    const handleDeletePack = (key: number) => {
        const newPacks = packs.data.filter((pack, index) => index + 1 !== key)
        setPacks({ data: newPacks })
    }


    // Handlers Locatiopn FROM
    const handleStateChange = (value: string) => {
        setSelectedState(value)
        setValue("stateFrom", value)
    }

    const handleCityChange = (value: string) => {
        setSelectedCity(value)
        setValue("cityFrom", value)
    }
    // Handlers Locatiopn TO
    const handleStateToChange = (value: string) => {
        setSelectedStateTo(value)
        setValue("stateTo", value)
    }

    const handleCityToChange = (value: string) => {
        setSelectedCityTo(value)
        setValue("cityTo", value)
    }

    // FAqs functions
    const handleOpenModal = () => {
        setEditingFAQ(undefined)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingFAQ(undefined)
    }

    const handleSubmitFAQs = (faq: Omit<FAQ, "id">) => {
        if (editingFAQ) {
            updateFAQ({ ...faq, id: editingFAQ.id })
            console.log("FAQ updated successfully")
        } else {
            console.log("faqs:", faqs)
            addFAQ(faq)
            setValue("faqs", faqs)   // Add the new FAQ to the list of FAQs
            message.success("FAQ added successfully")
        }
    }

    const handleEdit = (faq: FAQ) => {
        setEditingFAQ(faq)
        setIsModalOpen(true)
    }

    const handleDelete = (id: string) => {
        deleteFAQ(id)
        message.success("FAQ deleted successfully")
    }

    const filteredFAQs = faqs.filter((faq) => faq.question.toLowerCase().includes(searchTerm.toLowerCase()))












    // -------------------------------------------------------------------- FUNCTIONS  ----------------------------------------------------------- //












    return (
        <>
            {/* ContextHolder to show messages error|warning|info */}
            {contextHolder}

            <Card>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <Row className="mb-4">
                        <Col span={10}>
                            <Label>Proveedor::</Label>
                            <h1> {selectedSupplier?.name} </h1>
                            <div hidden>
                                <Input
                                    value={values.idSupplier ? values.idSupplier : session.user.supplierId}
                                    {...register("supplierId")}
                                    disabled
                                    className="w-1/4"
                                    hidden={true}
                                />
                            </div>
                        </Col>

                        <Col span={4}>
                            <Label>
                                <h1>Servicio:</h1>
                            </Label>
                            <Select
                                // {...register("serviceType")}
                                // value={getValues("serviceType") || "tour"}
                                style={{ width: 120 }}
                                options={[
                                    { value: 'bus', label: 'bus', disabled: true },
                                    { value: 'tour', label: 'tour', },
                                    { value: 'hotel', label: 'hotel', disabled: true },
                                    { value: 'tickets', label: 'Tickets', disabled: true },
                                ]}
                                onChange={(value) => setValue("serviceType", value)}
                            />
                            {typeof errors.serviceCategory?.message === 'string' && (
                                <Alert showIcon type="error" message={errors.serviceCategory.message} />
                            )}
                        </Col>


                        <Col span={4}>
                            <Label>
                                <h1>Tipo:</h1>
                            </Label>
                            <Select
                                // {...register("serviceCategory")}
                                // value={getValues("serviceCategory") || "ecoturismo"}
                                style={{ width: 120 }}
                                options={[
                                    { value: 'ecoturismo', label: 'ecoturismo' },
                                    { value: 'paquete', label: 'paquete' },
                                    { value: 'festival', label: 'festival' },
                                    { value: 'familiar', label: 'familiar' },
                                ]}
                                onChange={(value) => setValue("serviceCategory", value)}
                            />
                            {typeof errors.serviceCategory?.message === 'string' && (
                                <Alert showIcon type="error" message={errors.serviceCategory.message} />
                            )}
                        </Col>


                        <Col span={4}>
                            <Label>
                                <h1>Tamaño:</h1>
                            </Label>
                            <Input
                                {...register("sizeTour", {
                                    setValueAs: value => parseFloat(value, 10)
                                })}
                                type="number"
                                min={1}
                            />
                            {typeof errors.sizeTour?.message === 'string' && (
                                <Alert showIcon type="error" message={errors.sizeTour.message} />
                            )}
                        </Col>

                    </Row>

                    <Row className="mb-4">
                        <Label>Fotos:</Label>

                        <Col span={24}>

                            <ImageUploader />

                            {errors.images?.imgBanner && (
                                <Alert
                                    showIcon
                                    type="error"
                                    message={errors.images.imgBanner.message}
                                />
                            )}

                            {errors.images?.imgAlbum && (
                                <Alert
                                    showIcon
                                    type="error"
                                    message={errors.images.imgAlbum.message}
                                />
                            )}
                        </Col>


                    </Row>

                    <Row className="mb-4">


                        <Col span={8}>

                            <Label>Nombre del Servicio:</Label>
                            <Input
                                {...register("name")}
                            />
                            {typeof errors.name?.message === 'string' && (
                                <Alert showIcon type="error" message={errors.name.message} />
                            )}
                        </Col>
                        <Col span={13}>
                            <Label>
                                <h1>Youtube video Llink:</h1>
                            </Label>
                            <Input
                                {...register("ytLink")}
                            />
                            {typeof errors.ytLink?.message === 'string' && (
                                <Alert showIcon type="error" message={errors.ytLink.message} />
                            )}
                        </Col>
                        <Col span={3} >
                            <Label>Precio Regular:</Label>
                            <Input
                                {...register("price", {
                                    setValueAs: value => parseFloat(value, 10)
                                })}
                            />
                            {
                                typeof errors.price?.message === 'string' && <Alert showIcon type="error" message={errors.price?.message} />
                            }
                        </Col>


                    </Row>
                    <Row className="mb-4">
                        <Col span={24}>
                            <Label>Descripcion:</Label>
                            <Textarea
                                {...register("description")}
                            />
                            {
                                typeof errors.description?.message === 'string' && <Alert showIcon type="error" message={errors.description?.message} />
                            }
                        </Col>
                    </Row>



















                    <Label> Paquetes:</Label>

                    <Row className="mb-4 mt-4">
                        <Col span={12} className="mb-4">
                            <Label className="mr-4">Desde:</Label>
                            <Controller
                                name="availableFrom"
                                control={control}
                                render={({ field }) => (
                                    <DatePickerWithRange
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {
                                typeof errors.availableFrom?.message === 'string' && <Alert showIcon type="error" message={errors.availableFrom?.message} />
                            }
                        </Col>

                        <Col span={12} className="mb-4">
                            <Label className="mr-4">Hasta:</Label>
                            <Controller
                                name="availableTo"
                                control={control}
                                render={({ field }) => (
                                    <DatePickerWithRange
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {
                                typeof errors.availableTo?.message === 'string' && <Alert showIcon type="error" message={errors.availableTo?.message} />
                            }
                        </Col>

                    </Row>

                    <Row className="mb-4 mt-4">

                        <Col span={12}>
                            <div
                                className={cn("flex flex-col space-y-4 p-4 bg-white rounded-lg shadow", "sm:flex-row sm:space-x-4 sm:space-y-0")}
                            >
                                <Label>Origen:</Label>
                                <Select
                                    className="w-full sm:w-1/2"
                                    placeholder="Selecciona el estado"
                                    onChange={handleStateChange}
                                    value={selectedState}
                                    options={Object.keys(statesCitiesData).map((state) => ({ value: state, label: state }))}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                />

                                <Select
                                    className="w-full sm:w-1/2"
                                    placeholder="Seleciona la Ciudad"
                                    onChange={handleCityChange}
                                    value={selectedCity}
                                    disabled={!selectedState}
                                    options={cities.map((city) => ({ value: city, label: city }))}
                                    notFoundContent={<div className="text-gray-500">No hay ciudades disponibles</div>}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                />


                            </div>
                        </Col>

                        <Col span={12}>
                            <div
                                className={cn("flex flex-col space-y-4 p-4 bg-white rounded-lg shadow", "sm:flex-row sm:space-x-4 sm:space-y-0")}
                            >
                                <Label>Destino:</Label>
                                <Select
                                    className="w-full sm:w-1/2"
                                    placeholder="Selecciona el Estado"
                                    onChange={handleStateToChange}
                                    value={selectedStateTo}
                                    options={Object.keys(statesCitiesData).map((state) => ({ value: state, label: state }))}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                />

                                <Select
                                    className="w-full sm:w-1/2"
                                    placeholder="Seleccciona la Ciudad"
                                    onChange={handleCityToChange}
                                    value={selectedCityTo}
                                    disabled={!selectedStateTo}
                                    options={citiesTo.map((city) => ({ value: city, label: city }))}
                                    notFoundContent={<div className="text-gray-500">No cities available</div>}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                />

                            </div>
                        </Col>


                    </Row>
                    <Row className="mb-4 mt-4">
                        <Col span={6}>
                            {typeof errors.stateFrom?.message === 'string' && (
                                <Alert showIcon type="error" message={errors.stateFrom.message} />
                            )}

                        </Col>
                        <Col span={6}>

                            {typeof errors.cityFrom?.message === 'string' && (
                                <Alert showIcon type="error" message={errors.cityFrom.message} />
                            )}

                        </Col>
                        <Col span={6}>

                            {typeof errors.stateTo?.message === 'string' && (
                                <Alert showIcon type="error" message={errors.stateTo.message} />
                            )}

                        </Col>
                        <Col span={6}>



                            {typeof errors.cityTo?.message === 'string' && (
                                <Alert showIcon type="error" message={errors.cityTo.message} />
                            )}
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <Label>Transporte:</Label>
                        </Col>
                        <Col>
                            <TransportProviderSearch />
                        </Col>
                        <Col>
                            {typeof errors.transportProviderID?.message === 'string' && (
                                <Alert showIcon type="error" message={errors.transportProviderID.message} />
                            )}
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <Label>Hotel:</Label>
                        </Col>
                        <Col>
                            <HotelSearch />
                        </Col>
                    </Row>



                    <Row >
                        <Col span={7}>
                            <Label>Tipo </Label>
                            <Input
                                value={pack.name}
                                onChange={(e) => setPack({ ...pack, name: e.target.value })}
                                placeholder="Tipo de Paquete"
                            />
                        </Col>
                        <Col span={7}>
                            <Label>Descripción</Label>
                            <Input
                                value={pack.description}
                                onChange={(e) => setPack({ ...pack, description: e.target.value })}
                                placeholder="Descripción"
                            />
                        </Col>
                        <Col span={3}>
                            <Label>Precio</Label>
                            <Input
                                value={pack.price}
                                placeholder="Price"
                                type="number"
                                onChange={(e) => setPack({ ...pack, price: parseFloat(e.target.value) })}
                            />
                        </Col>
                        <Col span={3}>
                            <Label>Cantidad</Label>
                            <Input
                                value={pack.qty}
                                type="number"
                                onChange={(e) => setPack({ ...pack, qty: parseFloat(e.target.value) })}
                                placeholder="Qty"
                            />
                        </Col>
                        <Col span={2}>
                            <Label>Agregar</Label>
                            <Button onClick={handleSbmitPcks} >+</Button>
                        </Col>
                    </Row>
                    <Row className="mb-4 mt-4">
                        <Col span={24}>

                            {
                                packs.data.length > 0 && (
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Table
                                                dataSource={packs?.data.map((pack, index) => ({ ...pack, key: index + 1 }))}
                                                columns={[
                                                    {
                                                        title: <b>ID</b>,
                                                        dataIndex: 'key',
                                                        key: 'key',
                                                    },
                                                    {
                                                        title: <b>Package Name</b>,
                                                        dataIndex: 'name',
                                                        key: 'name',
                                                    },
                                                    {
                                                        title: <b>Description</b>,
                                                        dataIndex: 'description',
                                                        key: 'description',
                                                    },
                                                    {
                                                        title: <b>Qty</b>,
                                                        dataIndex: 'qty',
                                                        key: 'qty',
                                                    },
                                                    {
                                                        title: <b>Price</b>,
                                                        dataIndex: 'price',
                                                        key: 'price',
                                                    },
                                                    {
                                                        title: <b>Delete</b>,
                                                        key: 'action',
                                                        render: (_, record) => (
                                                            <Label
                                                                onClick={() => handleDeletePack(record.key)}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                ❌
                                                            </Label>
                                                        ),
                                                    },
                                                ]}
                                            />
                                        </Col>
                                    </Row>
                                )
                            }

                            {
                                typeof errors.packs?.message === 'string' && <Alert showIcon type="error" message={errors.packs?.message} />
                            }
                        </Col>

                    </Row>

                    {/* Itinerar builder */}

                    <Row className="mb-4 mt-4">
                        <VirtualItinerary />
                        {typeof errors.itinerary?.message === 'string' && (
                            <Alert showIcon type="error" message={errors.itinerary.message} />
                        )}
                    </Row>






                    <Row className="mb-4 mt-4">

                        <Card className="w-full max-w-1xl mx-auto ">
                            <CardHeader>
                                <CardTitle>
                                    <Title level={4}>
                                        Servicios Inlcuidos
                                    </Title>
                                </CardTitle>
                            </CardHeader>
                            <CardContent style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <Row className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Col span={12}>
                                        <Title level={3} className="mb-4 flex items-center">
                                            <CheckCircle2 className="mr-2 text-green-500" />
                                            Incluido
                                        </Title>
                                        {
                                            typeof errors.includes?.message === 'string' && <Alert showIcon type="error" message={errors.includes?.message} />
                                        }

                                        <List
                                            dataSource={initialItems}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <Checkbox
                                                        checked={includes.includes(item.name)}
                                                        onChange={() => handleIncludeChange(item.name)}>
                                                        {item.name}
                                                    </Checkbox>
                                                </List.Item>
                                            )}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Title level={3} className="mb-4 flex items-center">
                                            <XCircle className="mr-2 text-red-500" />
                                            No Incluido
                                        </Title>
                                        {
                                            typeof errors.excludes?.message === 'string' && <Alert showIcon type="error" message={errors.excludes?.message} />
                                        }
                                        <List
                                            dataSource={initialItems}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <Checkbox
                                                        checked={excludes.includes(item.name)}
                                                        onChange={() => handleNotIncludeChange(item.name)}>
                                                        {item.name}
                                                    </Checkbox>
                                                </List.Item>
                                            )}
                                        />
                                    </Col>
                                </Row>

                            </CardContent>
                            <CardContent>

                                {(includes.length > 0 || excludes.length > 0) && (
                                    <div className="mt-6">
                                        <Title level={4}>Selected Items</Title>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-sm font-medium">Includes</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <List
                                                        dataSource={initialItems.filter((item) => includes.includes(item.name))}
                                                        renderItem={(item) => <List.Item>{item.name}</List.Item>}
                                                    />
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-sm font-medium">Not Includes</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <List
                                                        dataSource={initialItems.filter((item) => excludes.includes(item.name))}
                                                        renderItem={(item) => <List.Item>{item.name}</List.Item>}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                        </Card>

                        {/* <TourIncludes /> */}

                    </Row>




                    {/* FAQs builder */}
                    <div className="container mx-auto py-8">
                        {/* <FAQManager /> */}

                        <div className="max-w-4xl mx-auto p-4">
                            <h1 className="text-2xl font-bold mb-4">FAQ Manager</h1>
                            <div className="mb-4">
                                <Input
                                    placeholder="Search FAQs"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="mb-2"
                                />
                                {typeof errors.faqs?.message === 'string' && (
                                    <Alert showIcon type="error" message={errors.faqs.message} />
                                )}
                                <Button onClick={handleOpenModal}>
                                    <PlusCircleOutlined className="mr-2" />
                                    Add FAQ
                                </Button>
                            </div>
                            <FAQList faqs={filteredFAQs} onEdit={handleEdit} onDelete={handleDelete} />
                            <FAQModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmitFAQs} initialData={editingFAQ} />

                        </div>

                    </div>







                    <Input
                        {...register("location")}
                    />
                    {
                        typeof errors.location?.message === 'string' && <Alert showIcon type="error" message={errors.location?.message} />
                    }




                    <Button>
                        {
                            params.id ? "Update service" : "Create service"
                        }
                    </Button>
                </form>
            </Card >
        </>

    )
}