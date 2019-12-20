package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"github.com/urfave/cli"
)

func main() {
	app := &cli.App{
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:  "image-name",
				Usage: "Image name",
			},
			&cli.StringFlag{
				Name:  "image-tag",
				Usage: "Image tag",
			},
		},
		Action: func(c *cli.Context) error {

			// docker_bin_path := "/usr/bin/docker"
			// image_name := c.String("image-name")
			// image_tag := c.String("image-tag")

			// commnads := [4]string{
			// 	fmt.Sprintf("docker pull %s", image_name),
			// 	fmt.Sprintf("docker build --cache-from=%s -t %s -t %s:%s .", image_name, image_name, image_name, image_tag),
			// 	fmt.Sprintf("docker push %s:%s", image_name, image_tag),
			// 	fmt.Sprintf("docker push %s", image_name),
			// }

			// cmd := exec.Command(docker_bin_path, "docker build -t my-image .")
			out, err := exec.Command("docker ps").Output()
			// err := cmd.Run();
			if err != nil {
				fmt.Println("ERROR", err)
				log.Fatal(err);
			}

			output := string(out[:])
			fmt.Println(output)
			return nil
		},
	}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}
