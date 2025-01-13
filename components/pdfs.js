"use client";

const pdflist = ({ pdfs }) => {
  return (
    <div className="font-medium text-lg w-[90vw] mx-auto rounded-md">
      <div className="materials border-b border-white">
        <div className="bg-gray-800 text-white py-4 px-6 uppercase text-sm tracking-wide cursor-pointer hover:bg-gray-700 transition-all">
          MATERIALS
        </div>
        <div className="hidden bg-gray-50 text-gray-800">
          <div
            className="p-6 bg-no-repeat bg-center bg-contain"
            style={{
              backgroundImage: "url('/img/viitlogo.png')",
              backgroundSize: "170px 170px",
            }}
          >
            <div className="container-fluid">
              <div className="row">
                {pdfs.map((pdf) => (
                  <div
                    className="col-xl-3 col-lg-3 col-md-6 col-sm-12 mb-6"
                    key={pdf.name}
                  >
                    <h4 className="text-center text-xl font-semibold mb-4">
                      {pdf.name}
                    </h4>
                    <iframe
                      src={pdf.link}
                      className="w-full h-[350px] border border-gray-300 rounded-md"
                      title={pdf.name}
                    ></iframe>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default pdflist;
