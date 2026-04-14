import { PopoverContent, Popover, PopoverTrigger } from "./ui/popover";
import { Menu } from "lucide-react";

const MenuMobile = () => {
    return (
        <Popover>
            <PopoverTrigger>
                <Menu />
                <PopoverContent>
                    <p>inicio</p>
                    <p>vehiculos</p>
                    <p>refacciones</p>
                    <p>servicio</p>
                    <p>financiamiento</p>
                    <p>contacto</p>
                </PopoverContent>

            </PopoverTrigger>
        </Popover>

    );
}

export default MenuMobile;