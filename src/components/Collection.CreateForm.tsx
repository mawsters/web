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
import { useCreateCollectionMutation } from '@/data/clients/collections.api'

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title must be at least 1 character.',
  }),
})

export function CreateCollectionForm({
  className,
  setOpen,
}: {
  className: string
  setOpen: (open: boolean) => void
}) {
  // using Mutation from CollectionClient
  const [createCollection] = useCreateCollectionMutation()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // add a new collection into the database with the title
    createCollection({ title: values.title }).then(() => {
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
                  Don't worry! This collection title can be changed later.
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
