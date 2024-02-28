import { Progress } from "@/components/ui/Progress";
import { useGetCollectionsQuery } from "@/data/clients/collections.api"
import * as React from "react"

import { RocketIcon } from "@radix-ui/react-icons"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/Alert"
import { Collection, CollectionCreateButton } from "@/components/Collection";


export function ProgressDemo() {
    const [progress, setProgress] = React.useState(13)

    React.useEffect(() => {
        const timer = setTimeout(() => setProgress(66), 500)
        return () => clearTimeout(timer)
    }, [])

    return <Progress value={progress} className="w-[60%]" />
}

export function ErrorAlert({ error }: { error: string }) {
    return (
        <Alert>
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>
                {error}
            </AlertDescription>
        </Alert>
    )
}



const CollectionsPage = () => {
    const { data, isLoading, isError, error, isSuccess } = useGetCollectionsQuery();
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ProgressDemo />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ErrorAlert error={error.toString()} />
            </div>

        )
    }

    if (isSuccess) {
        console.log("Data", data)
        return (
            <div className="flex flex-col justify-center items-center mt-4">
                <div className="flex flex-row">
                    <h1 className="text-center font-bold mb-4 mr-3">Collections</h1>
                    <CollectionCreateButton />
                </div>


                <div className="w-full flex flex-wrap justify-center">
                    {data.map((collection) => {
                        return (
                            <Collection key={collection.id} collection={collection}>
                                <Collection.ViewCard className="flex relative items-center w-[500px] h-[100px] mb-5" />
                            </Collection>
                        );
                    })}
                </div>
            </div>

        )
    }
}

export default CollectionsPage
