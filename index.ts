import api from "@flatfile/api";
import * as Flatfile from "@flatfile/api/api";
import { Client, FlatfileEvent, FlatfileListener } from "@flatfile/listener";

export default function flatfileEventListener(listener: Client) {
  listener.filter({ job: "space:configure" }, (configure: FlatfileListener) => {
    configure.on(
      "job:ready",
      async ({ context: { spaceId, environmentId, jobId } }: FlatfileEvent) => {
        try {
          await api.jobs.ack(jobId, {
            info: "Job started.",
            progress: 10,
          })

          const testSheet = {
              name: 'Test Sheet',
              slug: 'testSheet',
              fields: [
                {
                  key: 'string',
                  type: 'string',
                  label: 'String',
                },
                {
                  key: 'number',
                  type: 'number',
                  label: 'Number',
                },
                {
                  key: 'enum',
                  type: 'enum',
                  label: 'Enum',
                  config: {
                    options: [
                      {
                        value: 'red',
                        label: 'Red',
                      },
                      {
                        value: 'blue',
                        label: 'Blue',
                      },
                      {
                        value: 'green',
                        label: 'Green',
                      },
                    ]
                  }
                },
                {
                  key: 'enumList',
                  type: 'enum-list',
                  label: 'Enum List',
                  config: {
                    options: [
                      {
                        value: 'Meeting',
                        label: 'Meeting',
                      },
                      {
                        value: 'New',
                        label: 'New',
                      },
                      {
                        value: 'Not a fit',
                        label: 'Not a fit',
                      },
                    ]
                  }
                },
              ],
            } as Flatfile.SheetConfig

          await api.workbooks.create({
            name: 'Testing List Types',
            spaceId,
            environmentId,
            sheets: [testSheet],
          })

          await api.jobs.complete(jobId, {
            outcome: {
              message: "Job completed.",
            },
          })
        } catch (error: any) {
          console.error(error)
          await api.jobs.fail(jobId, {
            outcome: {
              message: "Job error.",
            },
          })
        }
      }
    );
  });
}