import { useGetCollectionQuery } from "@/data/clients/collections.api";
import { useParams } from "react-router-dom";
import { ErrorAlert, ProgressDemo } from "@/pages/collections/index";
import { Collection } from "@/components/Collection";

const CollectionPage = () => {
    const { slug } = useParams();
    const { data, isLoading, isError, error, isSuccess } = useGetCollectionQuery(slug!);
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
            <Collection collection={data}>
                <div className="flex flex-col items-center justify-top h-screen">
                    <Collection.Header />
                    <Collection.BookList />
                </div>
            </Collection>
        )
    }
}

export default CollectionPage
