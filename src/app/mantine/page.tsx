import CustomButton from "@/common/components/mantine/button";


export default function Page() {
    return (
        <div className="flex items-center justify-items-center ">
            <CustomButton label="Click Me" color="blue" />
            <CustomButton label="Another Button" color="green" />

        </div>
    );
}
