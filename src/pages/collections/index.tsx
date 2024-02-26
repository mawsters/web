import { Progress } from "@/components/ui/Progress";
import { useGetCollectionsQuery } from "@/data/clients/collections.api"
import * as React from "react"

import { RocketIcon } from "@radix-ui/react-icons"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/Alert"
import { Collection } from "@/components/Collection";


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
            <ProgressDemo />
        )
    }

    if (isError) {
        return (
            <ErrorAlert error={error.toString()} />
        )
    }

    if (isSuccess) {
        console.log("Data", data)
        return (
            <div className="flex flex-col justify-center items-center mt-4">
                <h1 className="text-center font-bold mb-4">Collections</h1>

                <div className="w-full flex flex-wrap justify-center">
                    {data.map((collection) => {
                        return (
                            <Collection key={collection.id} collection={collection}>
                                <Collection.ViewCard className="m-2 text-center inline-block w-50 h-50" />
                            </Collection>
                        );
                    })}
                </div>
            </div>

        )
    }
}

export default CollectionsPage
