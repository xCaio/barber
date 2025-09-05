import React from "react";

const Contato = () => {
  return (
    <section className="pt-12 bg-primary w-full">
      <h2 className="text-4xl text-center sm:text-4xl md:text-6xl font-bold text-secondary pb-6">
        Contato & Localização
      </h2>
      <p className="text-center text-lg sm:text-2xl md:text-3xl font-bold text-text pb-10">
        Visite nossa barbearia ou entre em contato conosco. Estamos sempre
        prontos para atendê-lo.
      </p>

      <div className="flex flex-col mb-6 py-10 px-16 bg-card rounded-2xl max-w-fit h-auto mx-auto sm:max-w-xl md:max-w-2xl">
        <h3 className="text-secondary font-bold text-2xl text-center mb-4">
          Informações de contato
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 text-text"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <div className="mx-3">
              <p className="font-bold text-text">Endereço</p>
              <p className="font-bold text-text">Av. A, 343 - Mangueiras</p>
              <p className="font-bold text-text">
                Belo Horizonte - MG, 30666-420
              </p>
            </div>
          </div>

          <div className="flex items-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 text-text"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z"
              />
            </svg>

            <div className="mx-3">
              <p className="font-bold text-text">Telefone</p>
              <p className="font-bold text-text">(31) 9 9592-5295</p>
            </div>
          </div>

          <div className="flex items-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 text-text"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>

            <div className="mx-3">
              <p className="font-bold text-text">Email</p>
              <p className="font-bold text-text">contato@barbershop.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col my-6 py-10 px-16 bg-card rounded-2xl max-w-fit h-auto mx-auto sm:max-w-xl md:max-w-2xl">
        <h3 className="text-secondary font-bold text-2xl text-center mb-4">
          Horario de funcionamento
        </h3>
        <div className="flex justify-between">
          {/* Dias */}
          <div className="flex flex-col text-text font-bold">
            <span>Segunda - Sexta:</span>
            <span>Sábado:</span>
            <span>Domingo:</span>
          </div>
          {/* Horários */}
          <div className="flex flex-col text-text font-bold items-end">
            <span>08:00 - 21:00</span>
            <span>08:00 - 18:00</span>
            <span>Fechado</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col py-10 px-32 bg-card rounded-2xl max-w-fit h-auto mx-auto sm:max-w-xl md:max-w-2xl">
        <h3 className="text-secondary font-bold text-2xl text-center py-4">
          Redes Sociais
        </h3>
        <div className="flex justify-between py-4 gap-5">
          <a href="#">
            <svg
              width="800px"
              height="800px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="size-6 hover:scale-110 hover:bg-secondary rounded"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                fill="#d7d7d7"
              />
              <path
                d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"
                fill="#d7d7d7"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"
                fill="#d7d7d7"
              />
            </svg>
          </a>
          <a href="#">
            <svg
              width="800px"
              height="800px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-6 hover:scale-110 hover:bg-secondary rounded"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H15V13.9999H17.0762C17.5066 13.9999 17.8887 13.7245 18.0249 13.3161L18.4679 11.9871C18.6298 11.5014 18.2683 10.9999 17.7564 10.9999H15V8.99992C15 8.49992 15.5 7.99992 16 7.99992H18C18.5523 7.99992 19 7.5522 19 6.99992V6.31393C19 5.99091 18.7937 5.7013 18.4813 5.61887C17.1705 5.27295 16 5.27295 16 5.27295C13.5 5.27295 12 6.99992 12 8.49992V10.9999H10C9.44772 10.9999 9 11.4476 9 11.9999V12.9999C9 13.5522 9.44771 13.9999 10 13.9999H12V21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z"
                fill="#d7d7d7"
              />
            </svg>
          </a>
          <a href="#">
            <svg
              width="800px"
              height="800px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="size-6 hover:scale-110 hover:bg-secondary rounded"
            >
              <path
                d="M6.014 8.00613C6.12827 7.1024 7.30277 5.87414 8.23488 6.01043L8.23339 6.00894C9.14051 6.18132 9.85859 7.74261 10.2635 8.44465C10.5504 8.95402 10.3641 9.4701 10.0965 9.68787C9.7355 9.97883 9.17099 10.3803 9.28943 10.7834C9.5 11.5 12 14 13.2296 14.7107C13.695 14.9797 14.0325 14.2702 14.3207 13.9067C14.5301 13.6271 15.0466 13.46 15.5548 13.736C16.3138 14.178 17.0288 14.6917 17.69 15.27C18.0202 15.546 18.0977 15.9539 17.8689 16.385C17.4659 17.1443 16.3003 18.1456 15.4542 17.9421C13.9764 17.5868 8 15.27 6.08033 8.55801C5.97237 8.24048 5.99955 8.12044 6.014 8.00613Z"
                fill="#d7d7d7"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 23C10.7764 23 10.0994 22.8687 9 22.5L6.89443 23.5528C5.56462 24.2177 4 23.2507 4 21.7639V19.5C1.84655 17.492 1 15.1767 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23ZM6 18.6303L5.36395 18.0372C3.69087 16.4772 3 14.7331 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C11.0143 21 10.552 20.911 9.63595 20.6038L8.84847 20.3397L6 21.7639V18.6303Z"
                fill="#d7d7d7"
              />
            </svg>
          </a>
          <a href="#">
            <svg
              width="800px"
              height="800px"
              viewBox="0 0 48 48"
              id="Layer_2"
              data-name="Layer 2"
              xmlns="http://www.w3.org/2000/svg"
              class="size-6 hover:scale-110 hover:bg-secondary rounded"
            >
              <path
                class="cls-1"
                fill="#d7d7d7"
                d="M7.45,5.5a2,2,0,0,0-1.95,2V14.2L33.8,42.5h6.75a2,2,0,0,0,2-2V7.45a2,2,0,0,0-2-1.95ZM30.16,9.39a8.47,8.47,0,0,1,8.45,8.45h0c0,4.92-4,8.75-8.45,13.78-4.26-4.82-8.1-8.54-8.42-13.16v-.05c0-.19,0-.38,0-.57a8.45,8.45,0,0,1,8.45-8.45Zm0,4.39a4.06,4.06,0,0,0-4.06,4.06h0a4.06,4.06,0,0,0,4.06,4.06h0a4.06,4.06,0,0,0,0-8.12ZM5.5,27.18V40.55a2,2,0,0,0,2,2H20.82Z"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contato;
