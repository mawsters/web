import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/Button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { useUpdateCollectionMutation } from '@/data/clients/collections.api'

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title must be at least 1 character.',
  }),
})

export function EditCollectionForm({
  className,
  setOpen,
  id,
}: {
  className: string
  setOpen: (e: boolean) => void
  id: string
}) {
  // using Mutation from CollectionClient
  const [updateCollection] = useUpdateCollectionMutation()

  // 1. Define your form, this should only contain editable fields.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  })

  // 2. Define update submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // add a new collection into the database with the title
    updateCollection({ id, params: { title: values.title } }).then(() => {
      setOpen(false)
    })
    console.log(values)
  }

  return (
    <div className={className}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="New Collection Name"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter your new collection name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </div>
  )
}
