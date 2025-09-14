"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Sparkles,
  UserPlus,
  Trash2,
  Rocket,
  Loader2,
} from "lucide-react";
import { suggestAndAssignTasks } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TaskSuggestion } from "@/lib/definitions";

const formSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  date: z.date({ required_error: "Event date is required." }),
  venue: z.string().min(3, "Venue must be at least 3 characters."),
  organizingCommittee: z
    .array(z.object({ email: z.string().email("Invalid email address.") }))
    .min(1, "At least one committee member is required."),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateEventForm() {
  const [ocInput, setOcInput] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      venue: "",
      organizingCommittee: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "organizingCommittee",
  });

  const handleAddOcMember = () => {
    if (ocInput && z.string().email().safeParse(ocInput).success) {
      append({ email: ocInput });
      setOcInput("");
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
    }
  };

  const handleSuggestTasks = async () => {
    const formData = form.getValues();
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      form.trigger();
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill out all event details and add at least one OC member.",
      });
      return;
    }

    setIsSuggesting(true);
    const response = await suggestAndAssignTasks({
      eventDetails: `Name: ${formData.name}, Description: ${formData.description}, Date: ${formData.date}, Venue: ${formData.venue}`,
      organizingCommitteeMembers: formData.organizingCommittee.map(
        (m) => m.email
      ),
    });

    setIsSuggesting(false);

    if (response.success && response.data) {
      setSuggestions(response.data);
      setIsDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Suggestion Failed",
        description: response.error || "Could not generate task suggestions.",
      });
    }
  };

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: "Event Created!",
      description: `Your event "${values.name}" has been successfully created.`,
    });
    form.reset();
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., InnovateX Hackathon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your event..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date & Time</FormLabel>
                      <DatePicker field={field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Main Auditorium" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organizing Committee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  value={ocInput}
                  onChange={(e) => setOcInput(e.target.value)}
                  placeholder="Add member by email"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddOcMember(); } }}
                />
                <Button type="button" onClick={handleAddOcMember}>
                  <UserPlus className="mr-2 h-4 w-4" /> Add
                </Button>
              </div>
              <FormField
                control={form.control}
                name="organizingCommittee"
                render={() => (
                  <FormItem>
                    {fields.length > 0 && (
                      <ul className="space-y-2">
                        {fields.map((field, index) => (
                          <li
                            key={field.id}
                            className="flex items-center justify-between p-2 bg-muted rounded-md"
                          >
                            <span>{field.email}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSuggestTasks}
              disabled={isSuggesting}
            >
              {isSuggesting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              AI-Powered Task Assigner
            </Button>
            <Button type="submit" size="lg">
              <Rocket className="mr-2 h-4 w-4" />
              Launch Event
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>AI Task Suggestions</DialogTitle>
            <DialogDescription>
              Here are some tasks suggested by our AI based on your event details.
              Review and confirm the assignments.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Suggested Task</TableHead>
                  <TableHead>Reasoning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestions.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{s.member}</TableCell>
                    <TableCell>{s.task}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {s.reason}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Confirm Assignments</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
